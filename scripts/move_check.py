"""Proves that a move of files or a conversion of declarations changed nothing but paths: compares the registry, runs the
snapshots and refuses a wave during a merge.

before FILE writes the registry the sync writes; after FILE [old.module=new.module ...] compares the registry now with it,
sort by sort and entry by entry, and prints each difference as the sort, the entry's name and the field, such as
"windows coding.files: title changed", "agent_groups merger: missing" or "layout coding/home: changed". --allow
sort.field names a field a conversion may drop, such as windows.reads; none is allowed unless named. A story compares
the same way through tests/stories/support/registry_compare.py."""

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

CONTRACT_COMMANDS = ((str(ROOT / ".venv/bin/python3"), "-m", "pytest", "tests/unit/engine/module/test_plugin_event_contract.py", "-q"), ("journal", "sins"))
SOURCE_DERIVED_KEYS = {"module_fingerprints"}
NAME_FIELDS = ("name", "key", "folder", "type", "purpose", "model_name", "model")
NESTED_FIELDS = ("declaration", "profile")
IMPORT_LINE = re.compile(r"\s*(from|import)\s")


def registry_text() -> str:
    from engine.database.database import Database
    from engine.module.journal_container import opened_container, synced_container
    from engine.journal.journal_home import JournalHome
    from engine.module.module_sync import ModuleSync
    from engine.registry.registry import Registry

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


def registry_differences(recorded_text: str, current_text: str, moves: Mapping[str, str], allowed: Sequence[str] = ()) -> list[str]:
    recorded, current = json.loads(renamed(recorded_text, moves)), json.loads(current_text)
    return [line for sort in sorted({*recorded, *current} - SOURCE_DERIVED_KEYS) for line in sort_differences(sort, recorded.get(sort), current.get(sort), allowed)]


def sort_differences(sort: str, recorded: object, current: object, allowed: Sequence[str]) -> list[str]:
    if recorded == current:
        return []
    if sort == "suites" and isinstance(recorded, list) and isinstance(current, list):
        return [*entry_differences(sort, without_pages(recorded), without_pages(current), allowed), *page_differences(recorded, current)]
    if isinstance(recorded, list) and isinstance(current, list) and all(isinstance(entry, dict) for entry in (*recorded, *current)):
        return entry_differences(sort, named_entries(recorded), named_entries(current), allowed)
    if isinstance(recorded, dict) and isinstance(current, dict):
        return entry_differences(sort, recorded, current, allowed)
    return [f"{sort}: changed"]


def entry_differences(sort: str, recorded: Mapping[str, object], current: Mapping[str, object], allowed: Sequence[str]) -> list[str]:
    lines = []
    for name in sorted({*recorded, *current}):
        if name not in current:
            lines.append(f"{sort} {name}: missing")
        elif name not in recorded:
            lines.append(f"{sort} {name}: added")
        elif recorded[name] != current[name]:
            lines.extend(field_differences(sort, name, recorded[name], current[name], allowed))
    return lines


def field_differences(sort: str, name: str, recorded: object, current: object, allowed: Sequence[str]) -> list[str]:
    if not (isinstance(recorded, dict) and isinstance(current, dict)):
        return [f"{sort} {name}: changed"]
    fields = flat_fields(recorded), flat_fields(current)
    return [f"{sort} {name}: {field} changed" for field in sorted({*fields[0], *fields[1]})
            if fields[0].get(field) != fields[1].get(field) and f"{sort}.{field}" not in allowed]


# a declaration or a profile held in one field is compared field by field, as declaration.title
def flat_fields(entry: Mapping[str, object]) -> dict[str, object]:
    return {f"{key}.{inner}" if isinstance(value, dict) and key in NESTED_FIELDS else key: inner_value
            for key, value in entry.items() for inner, inner_value in (value.items() if isinstance(value, dict) and key in NESTED_FIELDS else [(key, value)])}


def named_entries(entries: Sequence[Mapping[str, object]]) -> dict[str, object]:
    named: dict[str, object] = {}
    for entry in entries:
        name = entry_name(entry)
        named[name if name not in named else f"{name}#{sum(1 for key in named if key.split('#')[0] == name) + 1}"] = entry
    return named


def entry_name(entry: Mapping[str, object]) -> str:
    for holder in (entry, *(entry[key] for key in NESTED_FIELDS if isinstance(entry.get(key), dict))):
        name = next((holder[field] for field in NAME_FIELDS if isinstance(holder, dict) and isinstance(holder.get(field), str) and holder[field]), None)
        if name is not None:
            return str(name)
    return str(entry.get("module", "entry"))


def without_pages(suites: Sequence[Mapping[str, object]]) -> dict[str, object]:
    return {str(suite["name"]): {key: value for key, value in suite.items() if key not in ("layouts", "presets")} for suite in suites}


# a suite's layouts are compared page by page and its presets preset by preset
def page_differences(recorded: Sequence[Mapping[str, object]], current: Sequence[Mapping[str, object]]) -> list[str]:
    def layouts(suites: Sequence[Mapping[str, object]]) -> dict[str, object]:
        return {f"{suite['name']}/{page}": shape for suite in suites for page, shape in dict(suite.get("layouts", {})).items()}

    def presets(suites: Sequence[Mapping[str, object]]) -> dict[str, object]:
        return {f"{suite['name']}/{page}/{preset['key']}": preset for suite in suites for page, listed in dict(suite.get("presets", {})).items() for preset in listed}

    return [*entry_differences("layout", layouts(recorded), layouts(current), ()), *entry_differences("preset", presets(recorded), presets(current), ())]


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
    after.add_argument("--allow", action="append", default=[], help="sort.field a conversion may drop, such as windows.reads")
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
        lines = registry_differences(Path(arguments.file).read_text(), registry_text(), parsed_moves(arguments.moves), arguments.allow)
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
