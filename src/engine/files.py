import difflib
import time
from dataclasses import dataclass
from functools import cache
from pathlib import Path

from engine import bus
from engine.proc import git, git_objects
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


@dataclass(frozen=True)
class LineCount:
    added: int
    removed: int

    @classmethod
    def between(cls, old: str, new: str) -> "LineCount":
        changed = [op for op in difflib.SequenceMatcher(None, old.splitlines(), new.splitlines()).get_opcodes() if op[0] != "equal"]
        return cls(sum(j2 - j1 for _, _, _, j1, j2 in changed), sum(i2 - i1 for _, i1, i2, _, _ in changed))


@dataclass(frozen=True)
class Indexed:
    stamp: int
    tree: dict


@dataclass(frozen=True)
class Hashed:
    modified: int
    size: int
    sha: str


@dataclass(frozen=True)
class FoundFile:
    path: str
    name: str
    size: int
    folder: bool = False


INDEXES: dict[Path, Indexed] = {}
HASHED: dict[Path, Hashed] = {}
UNTRACKED: dict[Path, tuple[str, ...]] = {}
MOST_FOUND = 50


@cache
def index_file(project: Path) -> Path:
    return project / git(["rev-parse", "--git-path", "index"], project).strip()


def tracked(project: Path) -> dict:
    try:
        stamp = index_file(project).stat().st_mtime_ns
    except OSError:
        stamp = 0
    held = INDEXES.get(project)
    if held is not None and held.stamp == stamp:
        return held.tree
    tree = {}
    for entry in git(["ls-files", "-s", "-z"], project).split("\0"):
        meta, _, path = entry.partition("\t")
        if path:
            tree[path] = meta.split()[1]
    INDEXES[project] = Indexed(stamp, tree)
    return tree


def unchanged(held: Hashed | None, stat) -> bool:
    return held is not None and (held.modified, held.size) == (stat.st_mtime_ns, stat.st_size)


def hashed(project: Path, paths: list[str]) -> dict:
    stats = {path: (project / path).stat() for path in paths}
    stale = [path for path, stat in stats.items() if not unchanged(HASHED.get(project / path), stat)]
    shas = git(["hash-object", "-w", "--stdin-paths"], project, stdin="\n".join(stale)).split() if stale else []
    if len(shas) == len(stale):
        HASHED.update({project / path: Hashed(stats[path].st_mtime_ns, stats[path].st_size, sha) for path, sha in zip(stale, shas)})
    return {path: HASHED[project / path].sha for path in paths if project / path in HASHED}


def blobs(record, project: Path) -> dict:
    tree = dict(tracked(project))
    dirty = list(dict.fromkeys(p for p in git(["ls-files", "-m", "-o", "-d", "--exclude-standard", "-z"], project).split("\0") if p))
    present = [p for p in dirty if (project / p).is_file()]
    UNTRACKED[project] = tuple(p for p in present if p not in tree)
    for path in set(dirty) - set(present):
        tree.pop(path, None)
    tree.update(hashed(project, present))
    marks = internal(record, project)
    return {path: sha for path, sha in tree.items() if not journals_own(path, marks)}


def blob_texts(project: Path, shas: list[str]) -> dict[str, str]:
    return {EMPTY_BLOB: "", **git_objects(project, [sha for sha in dict.fromkeys(shas) if sha != EMPTY_BLOB])}


def project_paths(project: Path) -> set[str]:
    if project not in UNTRACKED:
        UNTRACKED[project] = tuple(p for p in git(["ls-files", "-o", "--exclude-standard", "-z"], project).split("\0") if p)
    return {*tracked(project), *UNTRACKED[project]}


def found_files(project: Path, needle: str) -> list[FoundFile]:
    wanted = needle.strip().lower()
    ranked = sorted((match_rank(path, wanted), len(path), path) for path in project_paths(project) if wanted in path.lower())
    found = [project / path for _, _, path in ranked]
    return [FoundFile(str(path.relative_to(project)), path.name, path.stat().st_size) for path in found if path.is_file()][:MOST_FOUND]


def match_rank(path: str, wanted: str) -> int:
    name = path.rsplit("/", 1)[-1].lower()
    if name.startswith(wanted):
        return 0
    return 1 if wanted in name else 2


def line_counts(project: Path, pairs: list[tuple[str, str]]) -> dict[tuple[str, str], LineCount]:
    texts = blob_texts(project, [sha for pair in pairs for sha in pair])
    return {(before, after): LineCount.between(texts[before], texts[after]) for before, after in pairs}


def announce(record, agent: int) -> None:
    project = record.root.parent
    now = blobs(record, project)
    with record.state(SNAPSHOT).changing() as held:
        last = held.get("tree")
        held["tree"] = now
    if last is None:
        return
    at = time.time()
    changed = {path: (last.get(path, EMPTY_BLOB), now.get(path, EMPTY_BLOB)) for path in sorted(set(last) | set(now)) if last.get(path) != now.get(path)}
    counts = line_counts(project, list(changed.values()))
    for path, (before, after) in changed.items():
        count = counts[(before, after)]
        bus.emit(Event(0, at, "file", agent, "edit", SYSTEM, {"at": at, "path": path, "kind": change_kind(path, last, now), "before": before,
                                                             "after": after, "added": count.added, "removed": count.removed}), record)
