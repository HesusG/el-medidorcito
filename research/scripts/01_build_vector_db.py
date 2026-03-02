#!/usr/bin/env python3
"""
01_build_vector_db.py
Parse PDFs from research/papers/ → chunk → embed → store in ChromaDB.

Usage:
    python 01_build_vector_db.py

Expects PDFs organized in research/papers/<construct>/*.pdf
"""

import os
import sys
from pathlib import Path

import fitz  # PyMuPDF
import chromadb
from chromadb.utils import embedding_functions
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn

console = Console()

# Paths
SCRIPT_DIR = Path(__file__).parent
RESEARCH_DIR = SCRIPT_DIR.parent
PAPERS_DIR = RESEARCH_DIR / "papers"
CHROMA_DIR = RESEARCH_DIR / "chroma_db"

# Embedding model (multilingual for EN/ES support)
MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"

# Chunking params
CHUNK_SIZE = 500  # characters
CHUNK_OVERLAP = 100


def extract_text_from_pdf(pdf_path: Path) -> list[dict]:
    """Extract text from PDF, returning list of {page, text} dicts."""
    pages = []
    try:
        doc = fitz.open(str(pdf_path))
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text()
            if text.strip():
                pages.append({"page": page_num + 1, "text": text.strip()})
        doc.close()
    except Exception as e:
        console.print(f"[red]Error reading {pdf_path.name}: {e}[/red]")
    return pages


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """Split text into overlapping chunks by character count."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        if chunk.strip():
            chunks.append(chunk.strip())
        start = end - overlap
    return chunks


def scan_papers(papers_dir: Path) -> list[dict]:
    """Scan papers directory for PDFs, tagging each with its construct subdirectory."""
    papers = []
    for construct_dir in sorted(papers_dir.iterdir()):
        if not construct_dir.is_dir():
            continue
        construct = construct_dir.name
        for pdf_file in sorted(construct_dir.glob("*.pdf")):
            papers.append({
                "path": pdf_file,
                "construct": construct,
                "filename": pdf_file.name,
            })
    return papers


def main():
    console.print("[bold blue]== Build Vector Database ==[/bold blue]\n")

    # Check papers directory
    if not PAPERS_DIR.exists():
        console.print(f"[red]Papers directory not found: {PAPERS_DIR}[/red]")
        sys.exit(1)

    papers = scan_papers(PAPERS_DIR)
    if not papers:
        console.print("[yellow]No PDFs found in papers/ subdirectories.[/yellow]")
        console.print("Expected structure: papers/<construct>/*.pdf")
        console.print("Constructs: attachment, trust, communication, emotional_security, abandonment, independence")
        sys.exit(1)

    console.print(f"Found [green]{len(papers)}[/green] PDFs across constructs:\n")
    for p in papers:
        console.print(f"  [{p['construct']}] {p['filename']}")

    # Initialize ChromaDB
    console.print(f"\n[bold]Initializing ChromaDB at {CHROMA_DIR}...[/bold]")
    client = chromadb.PersistentClient(path=str(CHROMA_DIR))

    # Use sentence-transformers embedding function
    ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name=MODEL_NAME)

    # Delete existing collection if present (fresh build)
    try:
        client.delete_collection("relationship_papers")
        console.print("[yellow]Deleted existing collection.[/yellow]")
    except ValueError:
        pass

    collection = client.create_collection(
        name="relationship_papers",
        embedding_function=ef,
        metadata={"hnsw:space": "cosine"},
    )

    # Process each PDF
    total_chunks = 0
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TextColumn("{task.completed}/{task.total}"),
        console=console,
    ) as progress:
        task = progress.add_task("Processing PDFs...", total=len(papers))

        for paper in papers:
            pages = extract_text_from_pdf(paper["path"])
            paper_chunks = []
            paper_ids = []
            paper_metadatas = []

            for page_data in pages:
                chunks = chunk_text(page_data["text"])
                for i, chunk in enumerate(chunks):
                    chunk_id = f"{paper['filename']}__p{page_data['page']}__c{i}"
                    paper_chunks.append(chunk)
                    paper_ids.append(chunk_id)
                    paper_metadatas.append({
                        "paper_filename": paper["filename"],
                        "construct": paper["construct"],
                        "page_number": page_data["page"],
                    })

            if paper_chunks:
                # Add in batches of 100
                for batch_start in range(0, len(paper_chunks), 100):
                    batch_end = batch_start + 100
                    collection.add(
                        documents=paper_chunks[batch_start:batch_end],
                        ids=paper_ids[batch_start:batch_end],
                        metadatas=paper_metadatas[batch_start:batch_end],
                    )
                total_chunks += len(paper_chunks)

            progress.advance(task)

    console.print(f"\n[bold green]Done![/bold green] Stored {total_chunks} chunks in ChromaDB.")
    console.print(f"Collection: 'relationship_papers' ({collection.count()} documents)")


if __name__ == "__main__":
    main()
