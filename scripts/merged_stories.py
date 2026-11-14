"""Prints the test folders a merge reaches, one per line, from the files it changed between two commits: a module's
own stories and unit tests, everything that leans on the coding suite's shared support, and the engine's tests for an
engine change. A merge hook runs them on the merged code: python3 scripts/merged_stories.py BEFORE AFTER; a test picker
hands the changed files themselves: python3 scripts/merged_stories.py --files FILE..."""

import subprocess
import sys
from pathlib import Path

MODULE_ROOTS = ("src/core/modules/", "src/suites/coding/modules/")
WIDE_REACH = {
    "src/suites/coding/support/": ("tests/stories/suites/coding", "tests/stories/core/modules/drivers"),
    "src/engine/": ("tests/unit/engine", "tests/stories/engine", "tests/stories/core/modules/drivers"),
    "src/server/": ("tests/unit/server", "tests/stories/server"),
}


def changed_files(before: str, after: str) -> list[str]:
    listing = subprocess.run(["git", "diff", "--name-only", before, after], capture_output=True, text=True, check=True, timeout=60)
    return listing.stdout.split()


def module_folders(path: str) -> tuple[str, ...]:
    for root in MODULE_ROOTS:
        if not path.startswith(root):
            continue
        module = path[len(root):].split("/", 1)[0]
        relative = root.removeprefix("src/") + module
        return f"tests/stories/{relative}", f"tests/unit/{relative}"
    return ()


def reached_folders(path: str) -> tuple[str, ...]:
    if path.startswith("tests/") and path.endswith(".py"):
        return (str(Path(path).parent).split("/support", 1)[0],)
    wide = next((folders for prefix, folders in WIDE_REACH.items() if path.startswith(prefix)), ())
    return (*module_folders(path), *wide)


def main(paths: list[str]) -> None:
    folders = sorted({folder for path in paths for folder in reached_folders(path) if Path(folder).is_dir()})
    outermost = [folder for folder in folders if not any(folder.startswith(f"{other}/") for other in folders)]
    print("\n".join(outermost))


if __name__ == "__main__":
    main(sys.argv[2:] if sys.argv[1:2] == ["--files"] else changed_files(sys.argv[1], sys.argv[2]))
