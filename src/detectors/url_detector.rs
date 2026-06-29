use crate::detectors::DetectedTech;
use crate::fingerprints::FingerprintDb;
use regex::Regex;
use std::collections::HashMap;

pub fn detect(url: &str, db: &FingerprintDb, detections: &mut HashMap<String, DetectedTech>) {
    for (name, tech) in &db.technologies {
        if detections.contains_key(name) {
            continue;
        }

        if tech.url.is_empty() {
            continue;
        }

        let mut confidence: u8 = 0;

        for pattern in &tech.url {
            if let Ok(re) = Regex::new(pattern) {
                if re.is_match(url) {
                    confidence = 100;
                    break;
                }
            }
        }

        if confidence > 0 {
            detections.insert(
                name.clone(),
                DetectedTech {
                    name: name.clone(),
                    version: None,
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
