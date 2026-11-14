from pathlib import Path

SKILL = Path("src/suites/coding/modules/workers/skills/journal-merger/SKILL.md")
ROWS = ("A worktree is behind its base and works in another area", "A worktree is behind its base and overlaps the worker's files",
        "The update is large or risky for the worker's model", "A worker has not run an ordered update", "A worker could not settle the conflicts of an update")


def test_the_case_book_has_a_row_for_each_case_of_a_worktree_behind_its_base():
    rows = [line for line in SKILL.read_text().splitlines() if line.startswith("| ")]
    assert all(any(line.startswith(f"| {case} |") for line in rows) for case in ROWS)


def test_the_size_of_an_update_is_a_judgment_with_one_memory_per_decision():
    text = SKILL.read_text()
    assert "no number decides it" in text and "write one memory with `journal memory make`" in text
