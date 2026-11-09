"""Proves that a move of files changed nothing but paths: compares the registry, runs the snapshots and refuses a wave during a merge."""

import argparse
import json
import re
import subprocess
import sys
import tempfile
from collections.abc import Callable, Mapping, Sequence
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT))

CONTRACT_COMMANDS = ((str(ROOT / ".venv/bin/python3"), "-m", "pytest", "tests/unit/core/base/module/test_plugin_event_contract.py", "-q"), ("journal", "sins"))
SOURCE_DERIVED_KEYS = {"module_fingerprints"}
IMPORT_LINE = re.compile(r"\s*(from|import)\s")


def registry_text() -> str:
    from core.base.database.database import Database
    from core.base.journal_container import opened_container, synced_container
    from core.base.journal_home import JournalHome
    from core.base.module.module_sync import ModuleSync
    from core.base.registry.registry import Registry

    with tempfile.TemporaryDirectory() as folder:
        home = JournalHome(Path(folder) / ".journal")
        home.folder.mkdir(parents=True)
        sync_container = opened_container(home)
        sync_container.get(ModuleSync).run()
        sync_container.get(Database).close()
        read_container = synced_container(home)
        try:
            return read_container.get(Registry).entries_text()
        finally:
            read_container.get(Database).close()


def renamed(text: str, moves: Mapping[str, str]) -> str:
    for previous, moved in moves.items():
        text = re.sub(rf"(?<![\w.]){re.escape(previous)}(?!\w)", moved, text)
    return text


def registry_differences(recorded_text: str, current_text: str, moves: Mapping[str, str]) -> list[str]:
    recorded, current = json.loads(renamed(recorded_text, moves)), json.loads(current_text)
    return [f"registry entry {key} changed" for key in sorted({*recorded, *current} - SOURCE_DERIVED_KEYS) if recorded.get(key) != current.get(key)]


def non_move_lines(diff_text: str, moved_names: Sequence[str]) -> list[str]:
    changed = [line for line in diff_text.splitlines() if line[:1] in "+-" and not line.startswith(("+++", "---"))]
    return [line for line in changed if IMPORT_LINE.match(line[1:]) is None and not any(name in line for name in moved_names)]


def failed_commands(commands: Sequence[Sequence[str]], run: Callable[[Sequence[str]], int]) -> list[str]:
    failed: list[str] = []
    for command in commands:
        exit_code = run(command)
        if exit_code not in (0, 1) or (exit_code == 1 and command[0] != "journal"):
            failed.append(" ".join(command))
    return failed


def folders_merging(folders: Sequence[Path], merge_head_path: Callable[[Path], Path]) -> list[Path]:
    return [folder for folder in folders if merge_head_path(folder).exists()]


def merge_head(folder: Path) -> Path:
    git_path = subprocess.run(["git", "-C", str(folder), "rev-parse", "--git-path", "MERGE_HEAD"], capture_output=True, text=True, check=True).stdout.strip()
    return folder / git_path


def worktree_folders() -> list[Path]:
    listing = subprocess.run(["git", "-C", str(ROOT), "worktree", "list", "--porcelain"], capture_output=True, text=True, check=True).stdout
    return [Path(line.removeprefix("worktree ")) for line in listing.splitlines() if line.startswith("worktree ") and Path(line.removeprefix("worktree ")).is_dir()]


def parsed_moves(pairs: Sequence[str]) -> dict[str, str]:
    return dict(pair.split("=", 1) for pair in pairs)


def run_exit_code(command: Sequence[str]) -> int:
    return subprocess.run(command, cwd=ROOT).returncode


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("before").add_argument("file")
    after = commands.add_parser("after")
    after.add_argument("file")
    after.add_argument("moves", nargs="*", help="old.module=new.module")
    commands.add_parser("snapshots")
    commands.add_parser("wave")
    commit = commands.add_parser("commit")
    commit.add_argument("revision")
    commit.add_argument("moves", nargs="*", help="old.module=new.module")
    arguments = parser.parse_args()
    if arguments.command == "before":
        Path(arguments.file).write_text(registry_text())
        return 0
    if arguments.command == "after":
        lines = registry_differences(Path(arguments.file).read_text(), registry_text(), parsed_moves(arguments.moves))
    elif arguments.command == "snapshots":
        lines = [f"failed: {line}" for line in failed_commands(CONTRACT_COMMANDS, run_exit_code)]
    elif arguments.command == "wave":
        lines = [f"a merge is under way in {folder}" for folder in folders_merging(worktree_folders(), merge_head)]
    else:
        diff = subprocess.run(["git", "-C", str(ROOT), "show", "-M", "--format=", "-U0", arguments.revision], capture_output=True, text=True, check=True).stdout
        moves = parsed_moves(arguments.moves)
        lines = non_move_lines(diff, [*moves, *moves.values()])
    print("\n".join(lines) or "no differences")
    return 1 if lines else 0


if __name__ == "__main__":
    sys.exit(main())
