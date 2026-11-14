import ast
from pathlib import Path

from engine.testing.stories.story_body import INTERNAL_ACCESS
from tests.unit.source_tree import source_tree

ROOT = Path(__file__).resolve().parents[2]
STORIES = ROOT / "tests" / "stories"
WHAT_TO_DO = "a story works through the story kit; what needs story.container, monkeypatch, .database or Statement( is a unit test under tests/unit"


def is_test(node: ast.stmt) -> bool:
    return isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name.startswith("test_")


def internal_reach(path: Path) -> list[int]:
    source = path.read_text()
    lines = []
    for node in source_tree(path).body:
        members = node.body if isinstance(node, ast.ClassDef) else [node]
        for member in members:
            if is_test(member) and any(access in (ast.get_source_segment(source, member) or "") for access in INTERNAL_ACCESS):
                lines.append(member.lineno)
    return lines


def story_files(folder: Path = STORIES) -> list[Path]:
    return [path for path in sorted(folder.rglob("*.py")) if "support" not in path.parts and "__pycache__" not in path.parts]


def test_no_story_reaches_internals():
    reaching = [f"{path.relative_to(ROOT)}:{line}" for path in story_files() for line in internal_reach(path)]
    assert reaching == [], WHAT_TO_DO


def test_the_scan_finds_internal_reach_in_a_sample(tmp_path):
    sample = tmp_path / "sample.py"
    sample.write_text("def test_reaching(new_story):\n    new_story().container.get(object)\n\n\ndef test_plain(new_story):\n    new_story().run('task list')\n")
    assert internal_reach(sample) == [1]
