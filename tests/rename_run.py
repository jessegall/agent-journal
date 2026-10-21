# The rename tool builds the whole tree with mypy, so its test is not in the default run: python3 -m pytest tests/rename_run.py, after any change to scripts/refactoring/rename.py.

import importlib.util
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TREE = {
    "src/journal/__init__.py": "",
    "src/journal/clock.py": '''LIMIT = 3


class Clock:
    """A clock."""

    def now(self) -> float:
        return 1.0 * LIMIT
''',
    "src/journal/user.py": '''from journal.clock import LIMIT, Clock


class Other:
    """Another class with a method of the same name."""

    def now(self) -> float:
        return 2.0


def reading(clock: Clock, steps: int) -> float:
    total = clock.now() * steps + Other().now()
    return total + LIMIT


def caller() -> "Clock":
    print(reading(Clock(), steps=2))
    return Clock()
''',
    "tests/__init__.py": "",
}


def tool():
    spec = importlib.util.spec_from_file_location("rename", ROOT / "scripts/refactoring/rename.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def tree(tmp_path: Path) -> Path:
    for path, text in TREE.items():
        (tmp_path / path).parent.mkdir(parents=True, exist_ok=True)
        (tmp_path / path).write_text(text)
    shutil.copytree(ROOT / ".commandments/custom", tmp_path / ".commandments/custom")
    for command in (["init", "-q"], ["add", "-A"], ["-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "start"]):
        subprocess.run(["git", "-C", str(tmp_path), *command], check=True)
    return tmp_path


def test_each_kind_of_name_is_renamed_with_what_depends_on_it(tmp_path: Path, capsys):
    root = tree(tmp_path)
    renames = ["Clock.now", "time", "journal.clock.LIMIT", "CEILING", "src/journal/user.py:reading.steps", "count", "src/journal/user.py:reading.total", "product", "Clock", "Timepiece"]
    assert tool().main([f"--root={root}", *renames]) == 0, capsys.readouterr().out
    user = (root / "src/journal/user.py").read_text()
    assert not (root / "src/journal/clock.py").exists() and "class Timepiece" in (root / "src/journal/timepiece.py").read_text(), "a class named in its file moves with it"
    assert "from journal.timepiece import CEILING, Timepiece" in user, "the import follows the module and both names"
    assert "def caller() -> \"Timepiece\":" in user, "a quoted forward reference follows the class"
    assert "clock.time() * count + Other().now()" in user, "the method is renamed on its own class, never on another class's method of the same name"
    assert "def reading(clock: Timepiece, count: int)" in user and "reading(Timepiece(), count=2)" in user, "a parameter is renamed with the keyword arguments of its calls"
    assert "product = " in user and "return product + CEILING" in user, "a local and a module constant are renamed where they are read"


def test_a_banned_name_or_a_doubled_spot_writes_nothing(tmp_path: Path, capsys):
    root = tree(tmp_path)
    assert tool().main([f"--root={root}", "Clock.now", "said"]) == 1 and "banned" in capsys.readouterr().out
    assert tool().main([f"--root={root}", "--dry-run", "Clock.now", "time", "Clock.now", "moment"]) == 1 and "same spot" in capsys.readouterr().out, "two renames of one spot in one list are refused"
    assert "def now" in (root / "src/journal/clock.py").read_text(), "nothing was written"
