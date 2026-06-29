pub mod html_detector;
pub mod meta_detector;
pub mod cookie_detector;
pub mod script_detector;
pub mod url_detector;

use crate::fingerprints::{FingerprintDb, Technology};
use anyhow::Result;
use futures::stream::{self, StreamExt};
use reqwest::Client;
use serde::Serialize;
use std::collections::HashMap;
use std::time::Duration;
use tracing::info;

#[derive(Debug, Clone, Serialize)]
pub struct DetectedTech {
    pub name: String,
    pub version: Option<String>,
    pub confidence: u8,
    pub categories: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct ScanResult {
    pub url: String,
    pub technologies: Vec<DetectedTech>,
    pub headers: HashMap<String, String>,
    pub status: u16,
    pub elapsed_ms: u64,
}

pub struct TechDetector {
    db: FingerprintDb,
    client: Client,
}

impl TechDetector {
    pub fn new(db: FingerprintDb, follow_redirects: bool) -> Self {
        let client = Client::builder()
            .timeout(Duration::from_secs(30))
            .user_agent("techprobe/0.1.0")
            .danger_accept_invalid_certs(false)
            .redirect(if follow_redirects {
                reqwest::redirect::Policy::limited(5)
            } else {
                reqwest::redirect::Policy::none()
            })
            .build()
            .expect("Failed to build HTTP client");

        Self { db, client }
    }

    pub async fn scan_urls(&self, urls: &[String]) -> Result<Vec<ScanResult>> {
        let results: Vec<Result<ScanResult>> = stream::iter(urls)
            .map(|url| self.scan_url(url))
            .buffer_unordered(4)
            .collect()
            .await;

        Ok(results.into_iter().filter_map(|r| r.ok()).collect())
    }

    pub async fn scan_url(&self, url: &str) -> Result<ScanResult> {
        let start = std::time::Instant::now();
        info!("Scanning {}", url);

        let normalized = if !url.starts_with("http") {
            format!("https://{}", url)
        } else {
            url.to_string()
        };

        let response = self.client.get(&normalized).send().await?;
        let status = response.status().as_u16();
        let response_headers: HashMap<String, String> = response
            .headers()
            .iter()
            .map(|(k, v)| (k.to_string(), v.to_str().unwrap_or("").to_string()))
            .collect();

        let body = response.text().await.unwrap_or_default();
        let elapsed = start.elapsed().as_millis() as u64;

        let mut detections: HashMap<String, DetectedTech> = HashMap::new();

        self.detect_from_headers(&response_headers, &mut detections);
        self.detect_from_html(&body, &response_headers, &mut detections);
        self.detect_from_url(&normalized, &mut detections);

        let mut technologies: Vec<DetectedTech> = detections.into_values().collect();
        technologies.sort_by(|a, b| b.confidence.cmp(&a.confidence));

        Ok(ScanResult {
            url: normalized,
            technologies,
            headers: response_headers,
            status,
            elapsed_ms: elapsed,
        })
    }

    fn resolve_categories(&self, tech: &Technology) -> Vec<String> {
        tech.cats
            .iter()
            .filter_map(|id| self.db.categories.get(id).map(|c| c.name.clone()))
            .collect()
    }

    fn detect_from_headers(
        &self,
        headers: &HashMap<String, String>,
        detections: &mut HashMap<String, DetectedTech>,
    ) {
        for (name, tech) in &self.db.technologies {
            if detections.contains_key(name) {
                continue;
            }

            let mut confidence: u8 = 0;
            let mut version = None;

            for (header_name, pattern) in &tech.headers {
                if let Some(header_value) = headers.get(&header_name.to_lowercase()) {
                    if let Ok(re) = regex::Regex::new(pattern) {
                        if re.is_match(header_value) {
                            confidence = confidence.saturating_add(100);
                            if let Some(caps) = re.captures(header_value) {
                                if caps.len() > 1 {
                                    version = caps.get(1).map(|m| m.as_str().to_string());
                                }
                            }
                        }
                    }
                }
            }

            if confidence > 0 {
                detections.insert(
                    name.clone(),
                    DetectedTech {
                        name: name.clone(),
                        version,
                        confidence: confidence.min(100),
                        categories: self.resolve_categories(tech),
                    },
                );
            }
        }
    }

    fn detect_from_html(
        &self,
        html: &str,
        headers: &HashMap<String, String>,
        detections: &mut HashMap<String, DetectedTech>,
    ) {
        html_detector::detect(html, headers, &self.db, detections);
        meta_detector::detect(html, &self.db, detections);
        cookie_detector::detect(headers, &self.db, detections);
        script_detector::detect(html, &self.db, detections);
    }

    fn detect_from_url(
        &self,
        url: &str,
        detections: &mut HashMap<String, DetectedTech>,
    ) {
        url_detector::detect(url, &self.db, detections);
    }
}
