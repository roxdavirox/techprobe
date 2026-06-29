#[cfg(test)]
mod tests {
    use techprobe::fingerprints::FingerprintDb;

    #[test]
    fn test_load_fingerprints() {
        let db = FingerprintDb::load_default().expect("Failed to load fingerprints");
        assert!(!db.technologies.is_empty(), "No technologies loaded");
        assert!(!db.categories.is_empty(), "No categories loaded");
    }

    #[test]
    fn test_technology_fields() {
        let db = FingerprintDb::load_default().expect("Failed to load fingerprints");

        // Test WordPress fingerprint
        let wp = db
            .technologies
            .get("WordPress")
            .expect("WordPress not found");
        assert_eq!(wp.cats, vec![1, 11]);
        assert!(wp.website.is_some());
        assert!(wp.oss);
    }

    #[test]
    fn test_categories() {
        let db = FingerprintDb::load_default().expect("Failed to load fingerprints");

        // Test CMS category
        let cms = db.categories.get(&1).expect("CMS category not found");
        assert_eq!(cms.name, "CMS");
    }
}
