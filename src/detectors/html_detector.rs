use crate::detectors::DetectedTech;
use crate::fingerprints::FingerprintDb;
use regex::Regex;
use std::collections::HashMap;

pub fn detect(
    html: &str,
    _headers: &HashMap<String, String>,
    db: &FingerprintDb,
    detections: &mut HashMap<String, DetectedTech>,
) {
    for (name, tech) in &db.technologies {
        if detections.contains_key(name) {
            continue;
        }

        let mut confidence: u8 = 0;
        let mut version = None;

        for pattern in &tech.html {
            if let Ok(re) = Regex::new(pattern) {
                if re.is_match(html) {
                    confidence = confidence.saturating_add(100);
                    if let Some(caps) = re.captures(html) {
                        if caps.len() > 1 {
                            version = caps.get(1).map(|m| m.as_str().to_string());
                        }
                    }
                    break;
                }
            }
        }

        for pattern in &tech.text {
            if let Ok(re) = Regex::new(pattern) {
                if re.is_match(html) {
                    confidence = confidence.saturating_add(70);
                    break;
                }
            }
        }

        for pattern in &tech.css {
            if let Ok(re) = Regex::new(pattern) {
                if re.is_match(html) {
                    confidence = confidence.saturating_add(80);
                    break;
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
