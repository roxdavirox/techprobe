use crate::detectors::DetectedTech;
use crate::fingerprints::FingerprintDb;
use regex::Regex;
use std::collections::HashMap;

pub fn detect(html: &str, db: &FingerprintDb, detections: &mut HashMap<String, DetectedTech>) {
    for (name, tech) in &db.technologies {
        if detections.contains_key(name) {
            continue;
        }

        if tech.meta.is_empty() {
            continue;
        }

        let mut confidence: u8 = 0;
        let mut version = None;

        for (meta_name, pattern) in &tech.meta {
            let meta_regex = format!(
                r#"<meta[^>]*name\s*=\s*["']{}["'][^>]*content\s*=\s*["']([^"']*?)["']"#,
                regex::escape(meta_name)
            );
            if let Ok(re) = Regex::new(&meta_regex) {
                if let Some(caps) = re.captures(html) {
                    if let Some(content) = caps.get(1) {
                        if let Ok(value_re) = Regex::new(pattern) {
                            if value_re.is_match(content.as_str()) {
                                confidence = 100;
                                if caps.len() > 1 {
                                    version = caps.get(1).map(|m| m.as_str().to_string());
                                }
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
                    confidence,
                    categories: tech
                        .cats
                        .iter()
                        .filter_map(|id| db.categories.get(id).map(|c| c.name.clone()))
                        .collect(),
                },
            );
        }
    }
}
