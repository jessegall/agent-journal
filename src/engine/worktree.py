import shutil
import subprocess
from pathlib import Path

from resources.base import Refused, check_title

INCLUDED = ".worktreeinclude"
KEPT = "refs/journal/worktrees"


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
    kept = f"{KEPT}/{folder.name}"
    if not folder.is_dir():
        known = present(project, f"refs/heads/{branch}")
        start = () if known or not present(project, kept) else (kept,)
        made = git(project, "worktree", "add", str(folder), *((branch,) if known else ("-b", branch, *start)))
        if made.returncode:
            raise SystemExit(f"journal: the worktree {folder.name} could not be made: {made.stderr.strip()}")
        included(project, folder)
    keep(project, folder.name, branch)
    return folder


def keep(project: Path, name: str, branch: str) -> None:
    if present(project, f"refs/heads/{branch}"):
        git(project, "update-ref", f"{KEPT}/{name}", f"refs/heads/{branch}")


def merged(project: Path, branch: str, base: str) -> bool:
    ref = f"refs/heads/{branch}"
    if not present(project, ref) or tip(project, ref) == base:
        return False
    return git(project, "merge-base", "--is-ancestor", ref, "HEAD").returncode == 0


def tip(project: Path, ref: str = "HEAD") -> str:
    return git(project, "rev-parse", ref).stdout.strip()


def present(project: Path, ref: str) -> bool:
    return git(project, "rev-parse", "--verify", "--quiet", ref).returncode == 0


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


SHARED = (".journal", ".claude/settings.local.json")
SHARED_IN = (".claude/skills", ".agents/skills")


def share_journal(top: Path, root: Path) -> None:
    project = root.resolve().parent
    if top.resolve() == project:
        return
    wanted = [Path(path) for path in SHARED] + \
             [Path(folder) / entry.name for folder in SHARED_IN if (project / folder).is_dir() for entry in sorted((project / folder).iterdir())]
    made = [path for path in wanted if linked_to(top / path, (project / path).resolve())]
    if made:
        excluded(top, [f"/{path}" for path in made])


def linked_to(place: Path, target: Path) -> bool:
    if place.exists() or place.is_symlink() or not target.exists():
        return False
    place.parent.mkdir(parents=True, exist_ok=True)
    place.symlink_to(target, target_is_directory=target.is_dir())
    return True


def excluded(top: Path, patterns: list[str]) -> None:
    gitdir = Path((top / ".git").read_text().split(":", 1)[1].strip())
    exclude = (gitdir if gitdir.is_absolute() else top / gitdir).resolve().parents[1] / "info" / "exclude"
    held = exclude.read_text() if exclude.is_file() else ""
    missing = [pattern for pattern in patterns if pattern not in held.splitlines()]
    if missing:
        exclude.parent.mkdir(parents=True, exist_ok=True)
        exclude.write_text(held + ("" if not held or held.endswith("\n") else "\n") + "".join(f"{pattern}\n" for pattern in missing))
