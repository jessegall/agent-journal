import importlib.util
import shutil
import subprocess
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[3]
SCRIPT = ROOT / "scripts" / "refactoring" / "rename.py"
SPECIFICATION = importlib.util.spec_from_file_location("rename_tool", SCRIPT)
assert SPECIFICATION is not None and SPECIFICATION.loader is not None
script = importlib.util.module_from_spec(SPECIFICATION)
SPECIFICATION.loader.exec_module(script)

TREE = {
    "src/core/__init__.py": "",
    "src/core/clock.py": '''LIMIT = 3


class Clock:
    """A clock."""

    def now(self) -> float:
        return 1.0 * LIMIT
''',
    "src/core/user.py": '''from core.clock import LIMIT, Clock


class Other:
    """Another class with a method of the same name."""

    def now(self) -> float:
        return 2.0


def reading(clock: Clock, steps: int) -> float:
    total = clock.now() * steps + Other().now()
    return total + LIMIT


def doubled(steps: int) -> int:
    def inner(steps: int) -> int:
        return steps
    return inner(steps=steps) * 2


def caller() -> "Clock":
    print(reading(Clock(), steps=2))
    return Clock()
''',
    "tests/__init__.py": "",
}


@pytest.fixture
def root(tmp_path: Path) -> Path:
    for relative, text in TREE.items():
        (tmp_path / relative).parent.mkdir(parents=True, exist_ok=True)
        (tmp_path / relative).write_text(text)
    shutil.copytree(ROOT / ".commandments/custom", tmp_path / ".commandments/custom")
    for command in (["init", "-q"], ["add", "-A"], ["-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "The sample tree"]):
        subprocess.run(["git", "-C", str(tmp_path), *command], check=True, timeout=10)
    return tmp_path


def test_each_kind_of_name_is_renamed_with_what_depends_on_it(root: Path, capsys: pytest.CaptureFixture[str]) -> None:
    renames = ["Clock.now", "time", "core.clock.LIMIT", "CEILING", "src/core/user.py:reading.steps", "count", "src/core/user.py:reading.total", "product", "Clock", "Timepiece"]
    assert script.main([f"--root={root}", *renames]) == 0, capsys.readouterr().out
    user = (root / "src/core/user.py").read_text()
    assert not (root / "src/core/clock.py").exists() and "class Timepiece" in (root / "src/core/timepiece.py").read_text(), "a class named in its file moves with it"
    assert "from core.timepiece import CEILING, Timepiece" in user, "the import follows the module and both names"
    assert 'def caller() -> "Timepiece":' in user, "a quoted forward reference follows the class"
    assert "clock.time() * count + Other().now()" in user, "the method is renamed on its own class, never on another class's method of the same name"
    assert "def reading(clock: Timepiece, count: int)" in user and "reading(Timepiece(), count=2)" in user, "a parameter is renamed with the keyword arguments of its calls"
    assert "product = " in user and "return product + CEILING" in user, "a local and a module constant are renamed where they are read"


def test_a_banned_name_or_two_renames_of_one_position_write_nothing(root: Path, capsys: pytest.CaptureFixture[str]) -> None:
    assert script.main([f"--root={root}", "Clock.now", "said"]) == 1 and "banned" in capsys.readouterr().out
    assert script.main([f"--root={root}", "--dry-run", "Clock.now", "time", "Clock.now", "moment"]) == 1 and "same position" in capsys.readouterr().out
    assert "def now" in (root / "src/core/clock.py").read_text(), "nothing was written"


def test_a_dry_run_lists_every_place_and_writes_nothing(root: Path, capsys: pytest.CaptureFixture[str]) -> None:
    assert script.main([f"--root={root}", "--dry-run", "Clock.now", "time"]) == 0
    output = capsys.readouterr().out
    assert "Clock.now -> time: 2 places in 2 files" in output and "src/core/user.py:12" in output and "src/core/clock.py:7" in output
    assert "def now" in (root / "src/core/clock.py").read_text()


def test_every_parameter_and_local_of_a_name_is_renamed_with_its_keywords(root: Path, capsys: pytest.CaptureFixture[str]) -> None:
    assert script.main([f"--root={root}", "*steps", "amount", "*total", "product"]) == 0, capsys.readouterr().out
    user = (root / "src/core/user.py").read_text()
    assert "def reading(clock: Clock, amount: int)" in user and "def doubled(amount: int)" in user and "def inner(amount: int)" in user
    assert "return inner(amount=amount) * 2" in user and "reading(Clock(), amount=2)" in user, "every keyword of a call to a function that takes it"
    assert "product = clock.now() * amount" in user, "a local is renamed in its function"
