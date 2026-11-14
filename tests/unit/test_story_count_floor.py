import ast
from dataclasses import dataclass
from pathlib import Path

import pytest

from tests.unit.source_tree import source_tree

ROOT = Path(__file__).resolve().parents[2]
STORIES = ROOT / "tests" / "stories"
LEDGER = ROOT / "tests" / "unit" / "story_moves"
STORIES_AT_PLAN_START = 5907
LEDGER_KINDS = ("unit", "integration", "repeat", "folded")
LEDGER_ARROW = " -> "

# The stories of a removed rule are re-homed, never deleted. A commit that adds stories raises
# STORIES_AT_PLAN_START by as many in the same commit, so the floor keeps up with the count.
# Stories that walk the same steps are folded into one that keeps every check, as the overlap check asks; such a
# commit lowers the floor by as many and says so (task 8034 folded 14 stories of the assignments).
# A removed story writes its ledger line in the same commit (plan 1138).


@dataclass(frozen=True)
class LedgerLine:
    file: Path
    number: int
    story: str
    kind: str
    target: str


def is_test(node: ast.stmt) -> bool:
    return isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name.startswith("test_")


def story_count() -> int:
    count = 0
    for path in STORIES.rglob("*.py"):
        if "__pycache__" in path.parts:
            continue
        for node in source_tree(path).body:
            members = node.body if isinstance(node, ast.ClassDef) else [node]
            count += sum(1 for member in members if is_test(member))
    return count


def ledger_lines(folder: Path = LEDGER) -> list[LedgerLine]:
    lines = []
    for file in sorted(folder.glob("*.txt")):
        for number, text in enumerate(file.read_text().splitlines(), 1):
            if not text.strip() or text.lstrip().startswith("#"):
                continue
            story, arrow, rest = text.partition(LEDGER_ARROW)
            kind, _, target = rest.strip().partition(" ")
            assert arrow and kind in LEDGER_KINDS and target.strip(), f"{file.name}:{number} is no ledger line: write '<story> -> unit|integration|repeat|folded <test>'"
            lines.append(LedgerLine(file, number, story.strip(), kind, target.strip()))
    return lines


def defines(path: Path, name: str) -> bool:
    if not path.exists():
        return False
    for node in source_tree(path).body:
        members = node.body if isinstance(node, ast.ClassDef) else [node]
        if any(is_test(member) and member.name == name for member in members):
            return True
    return False


def test_no_story_is_deleted():
    count = story_count() + len(ledger_lines())
    assert count >= STORIES_AT_PLAN_START, f"{STORIES_AT_PLAN_START - count} stories were deleted: re-home the stories of a removed rule instead, or write a ledger line"


def test_every_ledger_line_names_a_test_that_exists():
    for line in ledger_lines():
        target_file = ROOT / line.target.split("::", 1)[0]
        story_file, _, story_name = line.story.partition("::")
        assert target_file.exists(), f"{line.file.name}:{line.number} names {line.target}, whose file does not exist"
        assert not defines(ROOT / story_file, story_name.split("[", 1)[0].split("::")[-1]), f"{line.file.name}:{line.number}: {line.story} is still there"


def test_a_malformed_ledger_line_is_named(tmp_path):
    (tmp_path / "core.modules.sample.txt").write_text("# a comment\n\ntests/stories/core/modules/sample.py::test_one moved somewhere\n")
    with pytest.raises(AssertionError, match="core.modules.sample.txt:3 is no ledger line"):
        ledger_lines(tmp_path)
