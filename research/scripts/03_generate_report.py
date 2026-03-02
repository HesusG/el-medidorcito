#!/usr/bin/env python3
"""
03_generate_report.py
Generate validation_report.md and questions_final.json from validation results.

Usage:
    python 03_generate_report.py
"""

import json
import sys
from pathlib import Path
from datetime import datetime
from collections import defaultdict

from rich.console import Console

console = Console()

SCRIPT_DIR = Path(__file__).parent
RESEARCH_DIR = SCRIPT_DIR.parent
OUTPUT_DIR = RESEARCH_DIR / "output"
QUESTIONS_FILE = RESEARCH_DIR / "questions_en.json"
CONSTRUCTS_FILE = RESEARCH_DIR / "constructs.json"
VALIDATION_FILE = OUTPUT_DIR / "validation_results.json"


def load_json(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def generate_report(validation: dict, constructs: dict, questions: dict) -> str:
    """Generate markdown validation report."""
    results = validation["results"]
    summary = validation["summary"]
    construct_map = {c["id"]: c for c in constructs["constructs"]}

    lines = [
        f"# Test del Amor — Validation Report",
        f"",
        f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        f"**Model:** paraphrase-multilingual-MiniLM-L12-v2",
        f"**Questions:** {summary['total']}",
        f"**Constructs:** {len(construct_map)}",
        f"",
        f"---",
        f"",
        f"## Overall Summary",
        f"",
        f"| Metric | Value |",
        f"|--------|-------|",
        f"| Total Questions | {summary['total']} |",
        f"| Construct-Aligned (Top-1) | {summary['aligned']}/{summary['total']} ({summary['aligned']/summary['total']*100:.0f}%) |",
        f"| Weak Backing (<0.3) | {summary['weak']} |",
        f"| Flagged | {summary['flagged']} |",
        f"",
    ]

    # Per-construct analysis
    construct_groups = defaultdict(list)
    for r in results:
        construct_groups[r["intended_construct"]].append(r)

    lines.append("## Per-Construct Analysis\n")

    for construct_id, group in construct_groups.items():
        c = construct_map.get(construct_id, {})
        avg_sim = sum(r["max_similarity"] for r in group) / len(group)
        aligned = sum(1 for r in group if r["construct_aligned"])

        lines.append(f"### {c.get('name_en', construct_id)} ({c.get('name_es', '')})")
        lines.append(f"")
        lines.append(f"**Theory:** {c.get('theory', 'N/A')}")
        lines.append(f"**Source:** {', '.join(c.get('source_instruments', []))}")
        lines.append(f"**Avg. Similarity:** {avg_sim:.4f}")
        lines.append(f"**Alignment:** {aligned}/{len(group)}")
        lines.append(f"")
        lines.append(f"| ID | Question (EN) | Sim | Aligned | Flags |")
        lines.append(f"|----|----|-----|---------|-------|")

        for r in group:
            flag_str = "; ".join(r["flags"]) if r["flags"] else "-"
            aligned_str = "YES" if r["construct_aligned"] else "**NO**"
            lines.append(f"| {r['id']} | {r['text_en'][:60]}... | {r['max_similarity']:.4f} | {aligned_str} | {flag_str} |")

        lines.append("")

    # Per-question detail
    lines.append("## Detailed Per-Question Results\n")

    for r in results:
        flag_icon = "!!" if r["flags"] else "OK"
        lines.append(f"### {r['id']} [{flag_icon}] — {r['intended_construct']}")
        lines.append(f"")
        lines.append(f"**EN:** {r['text_en']}")
        lines.append(f"**ES:** {r['text_es']}")
        lines.append(f"**Reverse-scored:** {'Yes' if r['reverse'] else 'No'}")
        lines.append(f"")
        lines.append(f"| Rank | Similarity | Construct | Paper | Page |")
        lines.append(f"|------|-----------|-----------|-------|------|")

        for i, m in enumerate(r["top_matches"], 1):
            match_icon = "**" if m["construct_match"] != r["intended_construct"] else ""
            lines.append(
                f"| {i} | {m['similarity']:.4f} | {match_icon}{m['construct_match']}{match_icon} | {m['paper']} | {m['page']} |"
            )

        if r["flags"]:
            lines.append(f"")
            lines.append(f"> **Flags:** {'; '.join(r['flags'])}")

        lines.append("")

    # Recommendations
    flagged = [r for r in results if r["flags"]]
    if flagged:
        lines.append("## Recommendations\n")
        for r in flagged:
            lines.append(f"- **{r['id']}** ({r['intended_construct']}): {'; '.join(r['flags'])}")
            lines.append(f"  - Consider rewording to better align with {r['intended_construct']} literature")
        lines.append("")

    return "\n".join(lines)


def generate_final_questions(validation: dict, questions: dict, constructs: dict) -> dict:
    """Generate final questions JSON with validation metadata."""
    results_map = {r["id"]: r for r in validation["results"]}
    construct_map = {c["id"]: c for c in constructs["constructs"]}

    final_questions = []
    for q in questions["questions"]:
        r = results_map.get(q["id"])
        if not r:
            continue

        final_questions.append({
            "id": q["id"],
            "construct": q["construct"],
            "construct_name_es": construct_map[q["construct"]]["name_es"],
            "text_en": q["text_en"],
            "text_es": q["text_es"],
            "reverse": q["reverse"],
            "source_instrument": q["source_instrument"],
            "validation": {
                "max_similarity": r["max_similarity"],
                "construct_aligned": r["construct_aligned"],
                "intended_in_top_k": r["intended_in_top_k"],
                "flagged": bool(r["flags"]),
            },
        })

    return {
        "version": 1,
        "generated": datetime.now().isoformat(),
        "model": "paraphrase-multilingual-MiniLM-L12-v2",
        "likert_scale": questions["likert_scale"],
        "constructs": constructs["constructs"],
        "questions": final_questions,
    }


def main():
    console.print("[bold blue]== Generate Validation Report ==[/bold blue]\n")

    # Load inputs
    if not VALIDATION_FILE.exists():
        console.print("[red]Validation results not found. Run 02_validate_questions.py first.[/red]")
        sys.exit(1)

    validation = load_json(VALIDATION_FILE)
    questions = load_json(QUESTIONS_FILE)
    constructs = load_json(CONSTRUCTS_FILE)

    # Generate report
    report = generate_report(validation, constructs, questions)
    report_file = OUTPUT_DIR / "validation_report.md"
    with open(report_file, "w", encoding="utf-8") as f:
        f.write(report)
    console.print(f"[green]Report saved to {report_file}[/green]")

    # Generate final questions
    final = generate_final_questions(validation, questions, constructs)
    final_file = OUTPUT_DIR / "questions_final.json"
    with open(final_file, "w", encoding="utf-8") as f:
        json.dump(final, f, indent=2, ensure_ascii=False)
    console.print(f"[green]Final questions saved to {final_file}[/green]")

    # Print summary
    flagged = [q for q in final["questions"] if q["validation"]["flagged"]]
    console.print(f"\n[bold]Final output:[/bold]")
    console.print(f"  Total questions: {len(final['questions'])}")
    console.print(f"  Flagged (need review): {len(flagged)}")
    console.print(f"\n[bold green]Done![/bold green]")


if __name__ == "__main__":
    main()
