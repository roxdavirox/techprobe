use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Technology {
    #[serde(default)]
    pub description: Option<String>,
    #[serde(default)]
    pub cats: Vec<u32>,
    #[serde(default)]
    pub website: Option<String>,
    #[serde(default)]
    pub icon: Option<String>,
    #[serde(default)]
    pub cpe: Option<String>,
    #[serde(default)]
    pub saas: bool,
    #[serde(default)]
    pub oss: bool,
    #[serde(default)]
    pub pricing: Vec<String>,
    #[serde(default)]
    pub implies: Vec<String>,
    #[serde(default)]
    pub requires: Vec<String>,
    #[serde(default)]
    pub excludes: Vec<String>,
    #[serde(default)]
    pub requires_category: Vec<u32>,
    #[serde(default)]
    pub headers: HashMap<String, String>,
    #[serde(default)]
    pub meta: HashMap<String, String>,
    #[serde(default)]
    pub cookies: HashMap<String, String>,
    #[serde(default)]
    pub script_src: Vec<String>,
    #[serde(default)]
    pub scripts: Vec<String>,
    #[serde(default)]
    pub html: Vec<String>,
    #[serde(default)]
    pub text: Vec<String>,
    #[serde(default)]
    pub css: Vec<String>,
    #[serde(default)]
    pub url: Vec<String>,
    #[serde(default)]
    pub robots: Vec<String>,
    #[serde(default)]
    pub dns: HashMap<String, Vec<String>>,
    #[serde(default)]
    pub js: HashMap<String, String>,
    #[serde(default)]
    pub dom: serde_json::Value,
    #[serde(default)]
    pub probe: HashMap<String, String>,
    #[serde(default)]
    pub xhr: Vec<String>,
    #[serde(default)]
    pub cert_issuer: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Category {
    pub id: u32,
    pub name: String,
    pub groups: Vec<String>,
}

#[derive(Debug)]
pub struct FingerprintDb {
    pub technologies: HashMap<String, Technology>,
    pub categories: HashMap<u32, Category>,
}

impl FingerprintDb {
    pub fn load_default() -> Result<Self> {
        let tech_json = include_str!("../../data/technologies.json");
        let cats_json = include_str!("../../data/categories.json");

        let technologies: HashMap<String, Technology> =
            serde_json::from_str(tech_json).context("Failed to parse technologies.json")?;

        let categories: HashMap<u32, Category> =
            serde_json::from_str(cats_json).context("Failed to parse categories.json")?;

        Ok(Self {
            technologies,
            categories,
        })
    }

    pub fn list_technologies(&self, category: Option<&str>, search: Option<&str>) {
        let mut techs: Vec<(&String, &Technology)> = self.technologies.iter().collect();
        techs.sort_by(|a, b| a.0.cmp(b.0));

        for (name, tech) in &techs {
            if let Some(cat_filter) = category {
                let cat_id: u32 = cat_filter.parse().unwrap_or(0);
                let cat_name = cat_filter.to_lowercase();
                let matches = tech.cats.contains(&cat_id)
                    || self.categories.values().any(|c| {
                        c.name.to_lowercase().contains(&cat_name) && tech.cats.contains(&c.id)
                    });
                if !matches {
                    continue;
                }
            }

            if let Some(search_term) = search {
                let search_lower = search_term.to_lowercase();
                if !name.to_lowercase().contains(&search_lower)
                    && !tech
                        .description
                        .as_ref()
                        .map(|d| d.to_lowercase().contains(&search_lower))
                        .unwrap_or(false)
                {
                    continue;
                }
            }

            let cats: Vec<String> = tech
                .cats
                .iter()
                .filter_map(|id| self.categories.get(id).map(|c| c.name.clone()))
                .collect();

            println!(
                "  {:<30} {}",
                name,
                if cats.is_empty() {
                    String::new()
                } else {
                    format!("[{}]", cats.join(", ")).dimmed().to_string()
                }
            );
        }
    }
}

use colored::Colorize;
