# The move tool runs git in a temp checkout, so its test is not in the default run: python3 -m pytest tests/move_run.py, after any change to scripts/refactoring/move.py.

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TREE = {
    "src/journal/__init__.py": "",
    "src/journal/support/__init__.py": "",
    "src/journal/support/cards.py": "class Cards:\n    pass\n",
    "src/journal/user.py": "from journal.support.cards import Cards\nimport journal.support.cards\n",
    "tests/test_user.py": "from journal.support.cards import Cards\n",
    "NOTES.md": "Cards live in journal.support.cards.\n",
}


def tree(tmp_path: Path) -> Path:
    for path, text in TREE.items():
        (tmp_path / path).parent.mkdir(parents=True, exist_ok=True)
        (tmp_path / path).write_text(text)
    for command in (["init", "-q"], ["add", "-A"], ["-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "start"]):
        subprocess.run(["git", "-C", str(tmp_path), *command], check=True, timeout=30)
    return tmp_path


def moved(root: Path, *args: str) -> subprocess.CompletedProcess:
    return subprocess.run([sys.executable, str(ROOT / "scripts/refactoring/move.py"), f"--root={root}", *args], capture_output=True, text=True, timeout=60)


def test_a_module_moves_with_every_name_of_it_and_its_new_package_is_made(tmp_path: Path):
    root = tree(tmp_path)
    assert moved(root, "journal.support.cards", "journal.chat.cards", "--dry-run").returncode == 0 and (root / "src/journal/support/cards.py").is_file(), "a dry run writes nothing"
    assert moved(root, "journal.support.cards", "journal.chat.cards").returncode == 0
    assert (root / "src/journal/chat/cards.py").is_file() and (root / "src/journal/chat/__init__.py").is_file() and not (root / "src/journal/support/cards.py").exists()
    assert (root / "src/journal/user.py").read_text() == "from journal.chat.cards import Cards\nimport journal.chat.cards\n"
    assert "journal.chat.cards" in (root / "tests/test_user.py").read_text() and "journal.chat.cards" in (root / "NOTES.md").read_text()


def test_a_missing_module_or_a_taken_place_writes_nothing(tmp_path: Path):
    root = tree(tmp_path)
    assert moved(root, "journal.support.nowhere", "journal.chat.nowhere").returncode == 1
    assert moved(root, "journal.support.cards", "journal.user").returncode == 1 and (root / "src/journal/support/cards.py").is_file()
