import os
from dataclasses import dataclass
from pathlib import Path

from engine.proc import git, git_env, ran
from engine.sync import NEVER_TRAVELS_IN_PROJECT

SNAPSHOT_REFS = "refs/journal/snapshots"
PROJECT = "project"
SKIPPED_FOLDERS = frozenset({".git", ".journal", ".claude", "node_modules"})
WHO = {"GIT_AUTHOR_NAME": "journal", "GIT_AUTHOR_EMAIL": "journal@localhost", "GIT_COMMITTER_NAME": "journal", "GIT_COMMITTER_EMAIL": "journal@localhost"}
LEFT_OUT = tuple(f":(exclude,glob)**/{name}{ending}" for name in NEVER_TRAVELS_IN_PROJECT for ending in ("", "/**"))


@dataclass(frozen=True)
class Snapshot:
    """One repository of the project as it stood: a commit of its working files kept under a ref of its own, on top of the commit it was taken on."""

    repository: str
    ref: str
    commit: str
    base: str


def repositories(project: Path) -> list[str]:
    """The project's own repository, written ".", and every repository nested inside it, as paths from the project; linked checkouts and dependencies are not nested repositories."""
    found = []
    for folder, names, _ in os.walk(project):
        here = Path(folder)
        if (here / ".git").exists():
            found.append(here.relative_to(project).as_posix())
        names[:] = sorted(name for name in names if name not in SKIPPED_FOLDERS)
    return found


def nested_in(repository: str, others: list[str]) -> list[str]:
    folder = Path(repository)
    return [Path(other).relative_to(folder).as_posix() for other in others if other != "." and Path(other).is_relative_to(folder)]


def key_of(repository: str) -> str:
    return PROJECT if repository == "." else repository.replace("/", "+")


def take(project: Path, name: str) -> list[Snapshot]:
    """Snapshots every repository of the project that has a commit, nested ones too, under refs/journal so garbage collection never drops them, leaving out what never travels."""
    everywhere = repositories(project)
    return [made for repository in everywhere if (made := snapshot_of(project, repository, name, [other for other in everywhere if other != repository]))]


def snapshot_of(project: Path, repository: str, name: str, others: list[str]) -> Snapshot | None:
    top = project / repository
    base = git(["rev-parse", "--verify", "-q", "HEAD"], top).strip()
    if not base:
        return None
    index = Path(git(["rev-parse", "--absolute-git-dir"], top).strip()) / f"journal-index-{os.getpid()}"
    nested = nested_in(repository, others)
    env = {**git_env(), **WHO, "GIT_INDEX_FILE": str(index)}
    try:
        ran(["git", "read-tree", base], top, 30, None, env)
        ran(["git", "add", "-A", "--", ".", *LEFT_OUT, *(f":(exclude){inside}" for inside in nested)], top, 60, None, env)
        written = ran(["git", "write-tree"], top, 30, None, env)
    finally:
        index.unlink(missing_ok=True)
    tree = written.stdout.strip() if written else ""
    if not tree:
        return None
    made = ran(["git", "commit-tree", tree, "-p", base, "-m", f"journal snapshot {name}"], top, 30, None, env)
    commit = made.stdout.strip() if made else ""
    if not commit:
        return None
    ref = f"{SNAPSHOT_REFS}/{name}/{key_of(repository)}"
    git(["update-ref", ref, commit], top)
    return Snapshot(repository, ref, commit, base)
