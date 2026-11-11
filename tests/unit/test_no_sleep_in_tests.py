import ast
from pathlib import Path

TESTS_FOLDER = Path(__file__).resolve().parents[1]
SLEEP_NAME = "sleep"


def sleep_lines(path: Path) -> list[int]:
    tree = ast.parse(path.read_text())
    calls = [node for node in ast.walk(tree) if isinstance(node, ast.Call) and SLEEP_NAME in (getattr(node.func, "attr", ""), getattr(node.func, "id", ""))]
    scripts = [node for node in ast.walk(tree) if isinstance(node, ast.Constant) and isinstance(node.value, str) and "def test_" in node.value and f"{SLEEP_NAME}(" in node.value]
    return sorted(node.lineno for node in (*calls, *scripts))


def test_no_test_sleeps_and_no_test_script_it_writes_sleeps():
    found = [f"{path.relative_to(TESTS_FOLDER.parent)}:{line}" for path in sorted(TESTS_FOLDER.rglob("*.py")) if path != Path(__file__).resolve() for line in sleep_lines(path)]
    assert found == [], "wait for the event, a process, a pipe or a thread, or move the clock with Story.advance:\n" + "\n".join(found)


def test_the_scan_finds_a_sleep_call_and_a_test_script_that_sleeps(tmp_path):
    sample = tmp_path / "sample_test.py"
    sample.write_text('import time\n\n\ndef test_wait():\n    time.sleep(1)\n\n\nSCRIPT = """\ndef test_inner():\n    sleep(2)\n"""\n')
    assert sleep_lines(sample) == [5, 8]
