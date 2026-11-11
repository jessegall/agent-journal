import ast
from pathlib import Path

from tests.unit.source_tree import source_tree

ROOT = Path(__file__).resolve().parents[2]
STORIES = ROOT / "tests" / "stories"
STORIES_AT_PLAN_START = 5865

# The stories of a removed rule are re-homed, never deleted. A commit that adds stories raises
# STORIES_AT_PLAN_START by as many in the same commit, so the floor keeps up with the count.


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


def test_no_story_is_deleted():
    count = story_count()
    assert count >= STORIES_AT_PLAN_START, f"{STORIES_AT_PLAN_START - count} stories were deleted: re-home the stories of a removed rule instead"
