"""Plays the journal's core flows before a push: a push is refused when one of them breaks."""
import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORKERS = "3"
LIMIT = 60.0


class NoInterpreter(RuntimeError):
    @classmethod
    def under(cls, roots: list[Path]) -> "NoInterpreter":
        looked = ", ".join(str(root / ".venv") for root in roots)
        return cls(f"the repository's interpreter is not there, so the flows cannot be played at all; looked in {looked}")


def checkouts() -> list[Path]:
    """This checkout, and the one the git directory belongs to: a worktree keeps no .venv of its own, and the system interpreter has none of the runner's plugins."""
    common = subprocess.run(["git", "rev-parse", "--path-format=absolute", "--git-common-dir"], cwd=ROOT, capture_output=True, text=True)
    main = Path(common.stdout.strip()).parent if common.returncode == 0 and common.stdout.strip() else ROOT
    return [ROOT] if main == ROOT else [ROOT, main]


def python() -> str:
    """The repository's own interpreter, which has the test runner's plugins. Raises rather than falling back to the system one, which would fail every flow and read as the flows breaking."""
    for root in checkouts():
        if (found := root / ".venv" / "bin" / "python").is_file():
            return str(found)
    raise NoInterpreter.under(checkouts())


def clean_environment() -> dict:
    """The environment without git's own variables: a push hook runs with GIT_DIR and the like set, and the flows' throwaway repositories would work on the pushing repository instead of their own."""
    return {name: value for name, value in os.environ.items() if not name.startswith("GIT_")}


def guard() -> int:
    began = time.time()
    try:
        runner = python()
    except NoInterpreter as missing:
        print(f"flows guard: {missing}", file=sys.stderr)
        return 1
    played = subprocess.run([runner, "-m", "pytest", "tests/test_the_flows.py", "-q", "-n", WORKERS], cwd=ROOT, env=clean_environment(), capture_output=True, text=True)
    took = time.time() - began
    if played.returncode:
        print("\n".join(line for line in played.stdout.splitlines() if line.startswith(("E ", "FAILED", "ERROR"))), file=sys.stderr)
        print(played.stderr, file=sys.stderr)
        print("flows guard: a core flow broke, push refused", file=sys.stderr)
        return 1
    print(f"flows guard: the core flows play in {took:.1f}s")
    if took > LIMIT:
        print(f"flows guard: slower than {LIMIT:.0f}s", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(guard())
