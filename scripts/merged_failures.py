"""Names the tests a merge broke: runs the test folders the merge reaches on the merged code, runs each test that failed
there again on the merge's parent commit in a scratch checkout, and prints the ones that passed before. A merge hook runs
it: python3 scripts/merged_failures.py BEFORE AFTER from the checkout the merge landed in. It exits 1 when it printed any."""

import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))  # run as a script, its folder is the only one on the path
from merged_stories import changed_files, reached_folders  # noqa: E402

PYTEST = [".venv/bin/python", "-m", "pytest", "-q", "-rf", "-n", "4", "--deselect", "stories::overlapping_steps"]
FAILED_LINE = re.compile(r"^FAILED (\S+)", re.MULTILINE)
LINKED = (".venv", "src/viewer/node_modules")


def failed_tests(output: str) -> list[str]:
    return list(dict.fromkeys(FAILED_LINE.findall(output)))


def broken_tests(failed_after: list[str], failed_before: list[str]) -> list[str]:
    return [name for name in failed_after if name not in failed_before]


def reached(before: str, after: str) -> list[str]:
    folders = sorted({folder for path in changed_files(before, after) for folder in reached_folders(path) if Path(folder).is_dir()})
    return [folder for folder in folders if not any(folder.startswith(f"{other}/") for other in folders)]


def run_tests(folder: Path, targets: list[str]) -> list[str]:
    finished = subprocess.run([*PYTEST, *targets], cwd=folder, capture_output=True, text=True, check=False)
    return failed_tests(finished.stdout)


def failed_before(before: str, names: list[str]) -> list[str]:
    scratch = Path(tempfile.mkdtemp(prefix="merged-failures-")) / "parent"
    subprocess.run(["git", "worktree", "add", "--detach", str(scratch), before], check=True, capture_output=True)
    try:
        for link in LINKED:
            if Path(link).exists() and not (scratch / link).exists():
                (scratch / link).symlink_to(Path(link).resolve(), target_is_directory=True)
        return run_tests(scratch, names)
    finally:
        subprocess.run(["git", "worktree", "remove", "--force", str(scratch)], check=False, capture_output=True)
        shutil.rmtree(scratch.parent, ignore_errors=True)


def main(before: str, after: str) -> int:
    folders = reached(before, after)
    failed_after = run_tests(Path("."), folders) if folders else []
    broken = broken_tests(failed_after, failed_before(before, failed_after)) if failed_after else []
    print("\n".join(broken))
    return 1 if broken else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1], sys.argv[2]))
