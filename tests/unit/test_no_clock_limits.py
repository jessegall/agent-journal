import ast
from pathlib import Path
from tests.unit.source_tree import source_tree

"""No test compares how long something took with a limit (rule 24): it fails under machine load and proves nothing
about the code. A test waits on the event instead; performance is measured in points."""

ROOT = Path(__file__).resolve().parents[2]
TESTS = ROOT / "tests"
CLOCKS = ("monotonic", "perf_counter", "process_time")


def is_clock_read(node: ast.expr) -> bool:
    if not isinstance(node, ast.Call):
        return False
    name = node.func.attr if isinstance(node.func, ast.Attribute) else node.func.id if isinstance(node.func, ast.Name) else ""
    return name in CLOCKS


def clock_limits(tree: ast.Module) -> list[int]:
    return [comparison.lineno for comparison in ast.walk(tree) if isinstance(comparison, ast.Compare)
            for side in (comparison.left, *comparison.comparators)
            if isinstance(side, ast.BinOp) and isinstance(side.op, ast.Sub) and (is_clock_read(side.left) or is_clock_read(side.right))]


def test_no_test_compares_an_elapsed_time():
    limits = [f"{path.relative_to(ROOT)}:{line}" for path in sorted(TESTS.rglob("*.py")) if "__pycache__" not in path.parts
              for line in clock_limits(source_tree(path))]
    assert not limits, "tests that compare an elapsed time with a limit:\n" + "\n".join(limits)


def test_a_planted_elapsed_time_limit_is_caught(tmp_path):
    planted = tmp_path / "planted.py"
    planted.write_text("import time\n\ndef test_it(run):\n    started = time.monotonic()\n    run()\n    assert time.monotonic() - started < 2\n")
    assert clock_limits(source_tree(planted)) == [6]
