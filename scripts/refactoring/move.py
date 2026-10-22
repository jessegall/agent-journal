"""Move a module of the journal package to another package, with every import of it.

  python3 scripts/refactoring/move.py journal.support.cards journal.chat.cards
  python3 scripts/refactoring/move.py --list=moves.txt --dry-run

A list line is `old.module new.module`, or `old.module new.module # why`; blank lines and lines starting with #
are skipped. The file moves with git mv, the packages it lands in get an __init__.py, and every dotted
name of the old module in src, tests, scripts, docs, NOTES.md and CLAUDE.md is written as the new one, but in
this tool and its test, whose examples name modules on purpose. A move
is refused when the old module is missing or the new one already stands; nothing is written when one is.
`--dry-run` names every move and how many files each touches without writing. `--names-only` writes the new
names and moves no file, for a branch that already holds the moved modules. `--root=DIR` works on another
checkout.
"""
import argparse
import re
import subprocess
import sys
from pathlib import Path

TEXT_GLOBS = ("src/**/*.py", "tests/**/*.py", "scripts/**/*.py", "docs/**/*.md")
TEXT_FILES = ("NOTES.md", "CLAUDE.md")
TOOL_FILES = ("scripts/refactoring/move.py", "tests/move_run.py")


def module_path(root: Path, dotted: str) -> Path:
    return root / "src" / Path(*dotted.split(".")).with_suffix(".py")


def moves_from(args: argparse.Namespace) -> list[tuple[str, str]]:
    if not args.list:
        return [(args.old, args.new)]
    lines = [line.split("#")[0].split() for line in Path(args.list).read_text().splitlines()]
    return [(parts[0], parts[1]) for parts in lines if len(parts) == 2]


def refusals(root: Path, moves: list[tuple[str, str]]) -> list[str]:
    missing = [f"{old}: no such module" for old, _ in moves if not module_path(root, old).is_file()]
    taken = [f"{new}: already stands" for _, new in moves if module_path(root, new).exists()]
    return missing + taken


def text_files(root: Path) -> list[Path]:
    found = [path for pattern in TEXT_GLOBS for path in root.glob(pattern) if path.relative_to(root).as_posix() not in TOOL_FILES]
    return found + [root / name for name in TEXT_FILES if (root / name).is_file()]


def rewritten(text: str, moves: list[tuple[str, str]]) -> str:
    names = dict(moves)
    pattern = re.compile(r"\b(" + "|".join(re.escape(old) for old in sorted(names, key=len, reverse=True)) + r")\b")
    return pattern.sub(lambda match: names[match.group(1)], text)


def packages(root: Path, dotted: str) -> list[Path]:
    folder = module_path(root, dotted).parent
    stop = root / "src"
    return [parent for parent in [folder, *folder.parents] if parent != stop and stop in parent.parents]


def move(root: Path, old: str, new: str) -> None:
    for folder in packages(root, new):
        folder.mkdir(parents=True, exist_ok=True)
        marker = folder / "__init__.py"
        if not marker.exists():
            marker.touch()
            subprocess.run(["git", "add", str(marker)], cwd=root, check=True)
    subprocess.run(["git", "mv", str(module_path(root, old)), str(module_path(root, new))], cwd=root, check=True)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("old", nargs="?")
    parser.add_argument("new", nargs="?")
    parser.add_argument("--list")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--names-only", action="store_true")
    parser.add_argument("--root", default=".")
    args = parser.parse_args()
    root, moves = Path(args.root).resolve(), moves_from(args)
    refused = [] if args.names_only else refusals(root, moves)
    if refused:
        print("\n".join(refused) + "\nnothing written: a move was refused")
        return 1
    touched = {path: rewritten(path.read_text(), moves) for path in text_files(root)}
    touched = {path: text for path, text in touched.items() if text != path.read_text()}
    for old, new in moves:
        users = sum(1 for path in touched if re.search(rf"\b{re.escape(old)}\b", path.read_text()))
        print(f"{old} -> {new}: {users} files name it")
    if args.dry_run:
        return 0
    for path, text in touched.items():
        path.write_text(text)
    for old, new in ([] if args.names_only else moves):
        move(root, old, new)
    print(f"{len(touched)} files changed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
