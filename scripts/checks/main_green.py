import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BRANCH = "main"
GREEN = ROOT / ".journal" / "runtime" / "main-green"
LOCK = "/private/tmp/aj-suite"
LIMIT = 1800


def git(*words: str, cwd: Path = ROOT) -> str:
    return subprocess.run(["git", *words], cwd=cwd, capture_output=True, text=True, check=True, timeout=120).stdout.strip()


def problems() -> list[str]:
    """Runs the default suite on the newest commit of main, once per commit, so a red main is said without anyone thinking to run it."""
    tip = git("rev-parse", BRANCH)
    if GREEN.is_file() and GREEN.read_text().strip() == tip:
        return []
    checkout = Path(tempfile.mkdtemp(prefix="main-green-"))
    try:
        git("worktree", "add", "--detach", "-q", str(checkout), tip)
        ran = subprocess.run(["lockf", "-k", "-t", str(LIMIT), LOCK, sys.executable, "-m", "pytest", "-q", "--timeout", "300"],
                             cwd=checkout, capture_output=True, text=True, timeout=LIMIT * 2)
    finally:
        subprocess.run(["git", "worktree", "remove", "--force", str(checkout)], cwd=ROOT, capture_output=True, timeout=120)
        shutil.rmtree(checkout, ignore_errors=True)
    if ran.returncode == 0:
        GREEN.parent.mkdir(parents=True, exist_ok=True)
        GREEN.write_text(tip)
        return []
    failed = [line for line in ran.stdout.splitlines() if line.startswith(("FAILED", "ERROR"))] or ran.stdout.splitlines()[-5:]
    return [f"main at {tip[:9]} is red:", *failed[:20]]


if __name__ == "__main__":
    text = problems()
    print("\n".join(text) if text else "main's newest commit passes the default suite")
    sys.exit(1 if text else 0)
