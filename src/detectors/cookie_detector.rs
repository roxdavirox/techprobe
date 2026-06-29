use crate::detectors::DetectedTech;
use crate::fingerprints::FingerprintDb;
use regex::Regex;
use std::collections::HashMap;

pub fn detect(
    headers: &HashMap<String, String>,
    db: &FingerprintDb,
    detections: &mut HashMap<String, DetectedTech>,
) {
    let set_cookie = headers.get("set-cookie").map(|v| v.as_str()).unwrap_or("");

    if set_cookie.is_empty() {
        return;
    }

    for (name, tech) in &db.technologies {
        if detections.contains_key(name) {
            continue;
        }

        if tech.cookies.is_empty() {
            continue;
        }

        let mut confidence: u8 = 0;
        let mut version = None;

        for (cookie_name, pattern) in &tech.cookies {
            let cookie_pattern = format!(r"(?i){}=", regex::escape(cookie_name));
            if let Ok(re) = Regex::new(&cookie_pattern) {
                if re.is_match(set_cookie) {
                    if pattern.is_empty() {
                        confidence = 100;
                    } else if let Ok(value_re) = Regex::new(pattern) {
                        if value_re.is_match(set_cookie) {
                            confidence = 100;
                            if let Some(caps) = value_re.captures(set_cookie) {
                                if caps.len() > 1 {
                                    version = caps.get(1).map(|m| m.as_str().to_string());
                                }
                            }
                        }
                    } else {
                        confidence = 100;
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
