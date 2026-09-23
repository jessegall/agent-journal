import time
from pathlib import Path

from engine import bus
from engine.proc import git
from providers import PROVIDERS
from providers.base import LIBRARY
from resources.base import SYSTEM, Event, names

KIND = names("edited", "created", "deleted")
EMPTY_BLOB = "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"
SNAPSHOT = "files"


def change_kind(path: str, last: dict, now: dict) -> str:
    if path not in last:
        return KIND.created
    return KIND.deleted if path not in now else KIND.edited


def internal(record, project: Path) -> tuple[str, ...]:
    roots = []
    for root in (record.root, record.root.resolve()):
        try:
            roots.append(str(root.relative_to(project)))
        except ValueError:
            try:
                roots.append(str(root.relative_to(project.resolve())))
            except ValueError:
                continue
    homes = (LIBRARY, *(cls.skill_home for cls in PROVIDERS.values() if cls.skill_home))
    return (*(f"{r}/" for r in dict.fromkeys(roots)), *(f"{h}/journal" for h in homes))


def journals_own(path: str, marks: tuple[str, ...]) -> bool:
    return any(path.startswith(m) or path == m.rstrip("/") for m in marks)


def blobs(record, project: Path) -> dict:
    tree = {}
    for entry in git(["ls-files", "-s", "-z"], project).split("\0"):
        meta, _, path = entry.partition("\t")
        if path:
            tree[path] = meta.split()[1]
    dirty = list(dict.fromkeys(p for p in git(["ls-files", "-m", "-o", "-d", "--exclude-standard", "-z"], project).split("\0") if p))
    present = [p for p in dirty if (project / p).is_file()]
    for path in set(dirty) - set(present):
        tree.pop(path, None)
    shas = git(["hash-object", "-w", "--stdin-paths"], project, stdin="\n".join(present)).split() if present else []
    if len(shas) == len(present):
        tree.update(zip(present, shas))
    marks = internal(record, project)
    return {path: sha for path, sha in tree.items() if not journals_own(path, marks)}


def numstat(project: Path, old: str, new: str) -> tuple[int, int]:
    added, removed = (git(["diff", "--numstat", old, new], project).split("\t") + ["", ""])[:2]
    return int(added) if added.isdigit() else 0, int(removed) if removed.isdigit() else 0


def announce(record, agent: int) -> None:
    project = record.root.parent
    now = blobs(record, project)
    with record.state(SNAPSHOT).changing() as held:
        last = held.get("tree")
        held["tree"] = now
    if last is None:
        return
    at = time.time()
    for path in sorted(p for p in set(last) | set(now) if last.get(p) != now.get(p)):
        before, after = last.get(path, EMPTY_BLOB), now.get(path, EMPTY_BLOB)
        added, removed = numstat(project, before, after)
        bus.emit(Event(0, at, "file", agent, "edit", SYSTEM, {"at": at, "path": path, "kind": change_kind(path, last, now), "before": before,
                                                             "after": after, "added": added, "removed": removed}), record)
