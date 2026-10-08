from dataclasses import dataclass
from pathlib import Path

from engine.comparison import Listing, compare
from engine.proc import git
from engine.snapshots import SNAPSHOT_REFS, Snapshot, apply, key_of, repositories, take
from resources.base import Refused

REMOTE = "hosted"


@dataclass(frozen=True)
class Pushed:
    pushed: tuple[str, ...]
    skipped: tuple[str, ...]


def has_remote(top: Path) -> bool:
    return bool(git(["remote", "get-url", REMOTE], top).strip())


def push(project: Path, name: str) -> Pushed:
    """Takes snapshots of the project and its nested repositories and pushes their refs to each repository's git remote called hosted; one without that remote is skipped, not failed."""
    sent, skipped = [], []
    for snapshot in take(project, name):
        top = project / snapshot.repository
        if not has_remote(top):
            skipped.append(snapshot.repository)
            continue
        git(["push", "--force", REMOTE, f"{snapshot.ref}:{snapshot.ref}"], top, 120)
        sent.append(snapshot.repository)
    return Pushed(tuple(sent), tuple(skipped))


def fetched(project: Path, name: str) -> list[Snapshot]:
    found = []
    for repository in repositories(project):
        top, ref = project / repository, f"{SNAPSHOT_REFS}/{name}/{key_of(repository)}"
        if not has_remote(top):
            continue
        git(["fetch", "--force", REMOTE, f"{ref}:{ref}"], top, 120)
        commit = git(["rev-parse", "--verify", "-q", ref], top).strip()
        if commit:
            found.append(Snapshot(repository, ref, commit, git(["rev-parse", f"{commit}^"], top).strip()))
    return found


def changed_by(project: Path, snapshot: Snapshot) -> list[str]:
    prefix = "" if snapshot.repository == "." else f"{snapshot.repository}/"
    names = git(["diff", "--name-only", "-z", snapshot.base, snapshot.commit], project / snapshot.repository, 30).split("\0")
    return [f"{prefix}{name}" for name in names if name]


def pull(project: Path, name: str) -> list[str]:
    """Fetches the snapshots a machine pushed and applies them, refusing when a file they change was also edited here: a branch switch here is not an edit, a changed file is."""
    snapshots = fetched(project, name)
    if not snapshots:
        raise Refused(f"no snapshot named {name} was found on the {REMOTE} remote of any repository here")
    before = Listing.of_project(project)
    clashes = sorted(path for snapshot in snapshots for path in changed_by(project, snapshot) if before.edited(path))
    if clashes:
        raise Refused(f"{len(clashes)} files the snapshot changes were also changed here, such as {', '.join(clashes[:3])}: put them aside first, then pull again")
    return apply(project, snapshots)


def summary(project: Path, before: Listing) -> str:
    seen = compare(before, Listing.of_project(project))
    return f"{len(seen.added)} added, {len(seen.changed)} changed, {len(seen.removed)} removed" + (", on another branch than before" if seen.switched else "")
