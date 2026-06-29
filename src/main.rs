mod detectors;
mod fingerprints;

use anyhow::Result;
use clap::{Parser, Subcommand};
use colored::Colorize;
use detectors::TechDetector;
use fingerprints::FingerprintDb;
use std::path::PathBuf;

#[derive(Parser)]
#[command(name = "techprobe")]
#[command(about = "High-performance web technology detector", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,

    #[arg(short, long, global = true, action = clap::ArgAction::Count)]
    verbose: u8,
}

#[derive(Subcommand)]
enum Commands {
    Scan {
        #[arg(required = true)]
        urls: Vec<String>,

        #[arg(short, long, default_value = "false")]
        follow_redirects: bool,

        #[arg(short, long)]
        output: Option<PathBuf>,

        #[arg(short = 'F', long, default_value = "text")]
        format: OutputFormat,
    },
    List {
        #[arg(short, long)]
        category: Option<String>,

        #[arg(short, long)]
        search: Option<String>,
    },
    Update {
        #[arg(short, long)]
        source: Option<String>,
    },
}

#[derive(Clone, clap::ValueEnum)]
enum OutputFormat {
    Text,
    Json,
    Csv,
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                match cli.verbose {
                    0 => "warn",
                    1 => "info",
                    2 => "debug",
                    _ => "trace",
                }
                .into()
            }),
        )
        .init();

    let db = FingerprintDb::load_default()?;

    match cli.command {
        Commands::Scan {
            urls,
            follow_redirects,
            output,
            format,
        } => {
            let detector = TechDetector::new(db, follow_redirects);
            let results = detector.scan_urls(&urls).await?;

            match format {
                OutputFormat::Text => print_results_text(&results),
                OutputFormat::Json => print_results_json(&results)?,
                OutputFormat::Csv => print_results_csv(&results),
            }

            if let Some(path) = output {
                let json = serde_json::to_string_pretty(&results)?;
                std::fs::write(path, json)?;
            }
        }
        Commands::List { category, search } => {
            db.list_technologies(category.as_deref(), search.as_deref());
        }
        Commands::Update { source } => {
            println!(
                "{}",
                "Fingerprint update not yet implemented".yellow()
            );
            if let Some(src) = source {
                println!("Source: {}", src);
            }
        }
    }

    Ok(())
}

fn print_results_text(results: &[detectors::ScanResult]) {
    for result in results {
        println!(
            "\n{} {}",
            "Target:".bold().cyan(),
            result.url.bold()
        );
        println!("{}", "─".repeat(60));

        if result.technologies.is_empty() {
            println!("  {}", "No technologies detected".yellow());
            continue;
        }

        for tech in &result.technologies {
            let version = tech
                .version
                .as_ref()
                .map(|v| format!(" v{}", v))
                .unwrap_or_default();

            let confidence = if tech.confidence < 100 {
                format!(" ({}% confidence)", tech.confidence).dimmed().to_string()
            } else {
                String::new()
            };

            let categories = tech.categories.join(", ");

            println!(
                "  {} {}{} — {} {}",
                "●".green(),
                tech.name.bold(),
                version.bold(),
                categories.dimmed(),
                confidence
            );
        }

        println!(
            "\n{} {} technologies detected",
            "→".cyan(),
            result.technologies.len().to_string().bold()
        );
    }
}

fn print_results_json(results: &[detectors::ScanResult]) -> Result<()> {
    println!("{}", serde_json::to_string_pretty(results)?);
    Ok(())
}

fn print_results_csv(results: &[detectors::ScanResult]) {
    println!("url,technology,version,confidence,categories");
    for result in results {
        for tech in &result.technologies {
            println!(
                "{},{},{},{},{}",
                result.url,
                tech.name,
                tech.version.as_deref().unwrap_or("-"),
                tech.confidence,
                tech.categories.join(";")
            );
        }
    }
}
