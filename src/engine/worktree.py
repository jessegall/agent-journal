import shutil
import subprocess
from pathlib import Path

from resources.base import Refused, check_title

INCLUDED = ".worktreeinclude"


def checkout(start: Path) -> Path | None:
    for here in (start, *start.parents):
        marker = here / ".git"
        if marker.is_dir():
            return None
        if marker.is_file():
            return here if "/worktrees/" in marker.read_text() else None
    return None


def environment(top: Path | None) -> str:
    try:
        return check_title(top.name) if top else ""
    except Refused:
        return ""


def linked(project: Path) -> set[str]:
    listed = git(project, "worktree", "list", "--porcelain")
    folders = [line.split(" ", 1)[1] for line in listed.stdout.splitlines() if line.startswith("worktree ")] if not listed.returncode else []
    return {Path(folder).name for folder in folders[1:]}


def opened(project: Path, folder: Path, branch: str) -> Path:
    if folder.is_dir():
        return folder
    known = git(project, "rev-parse", "--verify", "--quiet", f"refs/heads/{branch}").returncode == 0
    made = git(project, "worktree", "add", str(folder), *((branch,) if known else ("-b", branch)))
    if made.returncode:
        raise SystemExit(f"journal: the worktree {folder.name} could not be made: {made.stderr.strip()}")
    included(project, folder)
    return folder


def included(project: Path, folder: Path) -> None:
    listed = project / INCLUDED
    patterns = [line.strip() for line in listed.read_text().splitlines() if line.strip() and not line.startswith("#")] if listed.is_file() else []
    for found in (path for pattern in patterns for path in project.glob(pattern) if path.is_file()):
        copy = folder / found.relative_to(project)
        if not copy.exists():
            copy.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(found, copy)


def git(project: Path, *args: str) -> subprocess.CompletedProcess:
    try:
        return subprocess.run(["git", *args], cwd=project, capture_output=True, text=True, timeout=60)
    except (OSError, subprocess.TimeoutExpired) as failed:
        return subprocess.CompletedProcess(["git", *args], 1, "", str(failed))
