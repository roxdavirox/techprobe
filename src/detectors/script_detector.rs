use crate::detectors::DetectedTech;
use crate::fingerprints::FingerprintDb;
use regex::Regex;
use std::collections::HashMap;

pub fn detect(html: &str, db: &FingerprintDb, detections: &mut HashMap<String, DetectedTech>) {
    for (name, tech) in &db.technologies {
        if detections.contains_key(name) {
            continue;
        }

        if tech.script_src.is_empty() && tech.scripts.is_empty() {
            continue;
        }

        let mut confidence: u8 = 0;
        let mut version = None;

        for pattern in &tech.script_src {
            if let Ok(re) = Regex::new(pattern) {
                if re.is_match(html) {
                    confidence = confidence.saturating_add(90);
                    if let Some(caps) = re.captures(html) {
                        if caps.len() > 1 {
                            version = caps.get(1).map(|m| m.as_str().to_string());
                        }
                    }
                    break;
                }
            }
        }

        for pattern in &tech.scripts {
            if let Ok(re) = Regex::new(pattern) {
                if re.is_match(html) {
                    confidence = confidence.saturating_add(100);
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
