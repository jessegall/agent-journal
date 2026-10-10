"""Plays the journal's core flows before a push: a push is refused when one of them breaks."""
import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORKERS = "3"
LIMIT = 60.0


def python() -> str:
    """The repository's own interpreter, which has the test runner's plugins; the system one has none."""
    found = ROOT / ".venv" / "bin" / "python"
    return str(found) if found.is_file() else sys.executable


def clean_environment() -> dict:
    """The environment without git's own variables: a push hook runs with GIT_DIR and the like set, and the flows' throwaway repositories would work on the pushing repository instead of their own."""
    return {name: value for name, value in os.environ.items() if not name.startswith("GIT_")}


def guard() -> int:
    began = time.time()
    played = subprocess.run([python(), "-m", "pytest", "tests/test_the_flows.py", "-q", "-n", WORKERS], cwd=ROOT, env=clean_environment(), capture_output=True, text=True)
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
