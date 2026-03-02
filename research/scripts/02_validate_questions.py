#!/usr/bin/env python3
"""
02_validate_questions.py
Compare each question against paper chunks via cosine similarity.
Validates that questions map to their intended psychological construct.

Usage:
    python 02_validate_questions.py
"""

import json
import sys
from pathlib import Path

import chromadb
from chromadb.utils import embedding_functions
from rich.console import Console
from rich.table import Table

console = Console()

SCRIPT_DIR = Path(__file__).parent
RESEARCH_DIR = SCRIPT_DIR.parent
CHROMA_DIR = RESEARCH_DIR / "chroma_db"
QUESTIONS_FILE = RESEARCH_DIR / "questions_en.json"
OUTPUT_DIR = RESEARCH_DIR / "output"

MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"
TOP_K = 5
MIN_SIMILARITY = 0.3


def load_questions() -> list[dict]:
    """Load questions from JSON file."""
    with open(QUESTIONS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["questions"]


def main():
    console.print("[bold blue]== Validate Questions Against Literature ==[/bold blue]\n")

    # Load questions
    questions = load_questions()
    console.print(f"Loaded [green]{len(questions)}[/green] questions.\n")

    # Initialize ChromaDB
    if not CHROMA_DIR.exists():
        console.print("[red]ChromaDB not found. Run 01_build_vector_db.py first.[/red]")
        sys.exit(1)

    client = chromadb.PersistentClient(path=str(CHROMA_DIR))
    ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name=MODEL_NAME)

    try:
        collection = client.get_collection(
            name="relationship_papers",
            embedding_function=ef,
        )
    except ValueError:
        console.print("[red]Collection 'relationship_papers' not found. Run 01_build_vector_db.py first.[/red]")
        sys.exit(1)

    doc_count = collection.count()
    console.print(f"ChromaDB collection has [green]{doc_count}[/green] chunks.\n")

    if doc_count == 0:
        console.print("[red]Collection is empty. Add PDFs and rebuild.[/red]")
        sys.exit(1)

    # Validate each question
    results = []

    for q in questions:
        query_result = collection.query(
            query_texts=[q["text_en"]],
            n_results=TOP_K,
            include=["distances", "metadatas", "documents"],
        )

        # ChromaDB returns cosine distance; similarity = 1 - distance
        distances = query_result["distances"][0]
        metadatas = query_result["metadatas"][0]
        documents = query_result["documents"][0]

        top_matches = []
        for dist, meta, doc_text in zip(distances, metadatas, documents):
            similarity = 1 - dist
            top_matches.append({
                "similarity": round(similarity, 4),
                "construct_match": meta["construct"],
                "paper": meta["paper_filename"],
                "page": meta["page_number"],
                "excerpt": doc_text[:200] + "..." if len(doc_text) > 200 else doc_text,
            })

        # Check construct alignment
        top_construct = top_matches[0]["construct_match"] if top_matches else None
        construct_aligned = top_construct == q["construct"]
        max_similarity = top_matches[0]["similarity"] if top_matches else 0

        # Count how many of top-K match intended construct
        intended_count = sum(1 for m in top_matches if m["construct_match"] == q["construct"])

        # Flags
        flags = []
        if not construct_aligned:
            flags.append(f"DISCRIMINANT: Top match is '{top_construct}', expected '{q['construct']}'")
        if max_similarity < MIN_SIMILARITY:
            flags.append(f"WEAK: Max similarity {max_similarity:.4f} < {MIN_SIMILARITY}")

        results.append({
            "id": q["id"],
            "text_en": q["text_en"],
            "text_es": q["text_es"],
            "intended_construct": q["construct"],
            "reverse": q["reverse"],
            "max_similarity": max_similarity,
            "construct_aligned": construct_aligned,
            "intended_in_top_k": intended_count,
            "flags": flags,
            "top_matches": top_matches,
        })

    # Display summary table
    table = Table(title="Question Validation Summary")
    table.add_column("ID", style="bold")
    table.add_column("Construct", style="cyan")
    table.add_column("Max Sim", justify="right")
    table.add_column("Aligned", justify="center")
    table.add_column("Top-K Match", justify="right")
    table.add_column("Flags", style="yellow")

    for r in results:
        aligned_str = "[green]YES[/green]" if r["construct_aligned"] else "[red]NO[/red]"
        sim_color = "green" if r["max_similarity"] >= MIN_SIMILARITY else "red"
        flags_str = "; ".join(r["flags"]) if r["flags"] else "-"

        table.add_row(
            r["id"],
            r["intended_construct"],
            f"[{sim_color}]{r['max_similarity']:.4f}[/{sim_color}]",
            aligned_str,
            f"{r['intended_in_top_k']}/{TOP_K}",
            flags_str,
        )

    console.print(table)

    # Summary stats
    total = len(results)
    aligned = sum(1 for r in results if r["construct_aligned"])
    weak = sum(1 for r in results if r["max_similarity"] < MIN_SIMILARITY)
    flagged = sum(1 for r in results if r["flags"])

    console.print(f"\n[bold]Summary:[/bold]")
    console.print(f"  Total questions: {total}")
    console.print(f"  Construct-aligned: [green]{aligned}/{total}[/green]")
    console.print(f"  Weak backing (<{MIN_SIMILARITY}): [{'red' if weak else 'green'}]{weak}[/{'red' if weak else 'green'}]")
    console.print(f"  Flagged: [{'yellow' if flagged else 'green'}]{flagged}[/{'yellow' if flagged else 'green'}]")

    # Save results for report generation
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_file = OUTPUT_DIR / "validation_results.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump({"results": results, "summary": {
            "total": total,
            "aligned": aligned,
            "weak": weak,
            "flagged": flagged,
        }}, f, indent=2, ensure_ascii=False)

    console.print(f"\n[bold green]Results saved to {output_file}[/bold green]")


if __name__ == "__main__":
    main()
