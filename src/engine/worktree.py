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
    return subprocess.run(["git", *args], cwd=project, capture_output=True, text=True, timeout=60)
