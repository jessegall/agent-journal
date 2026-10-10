import difflib
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from pathlib import Path

from engine import bus
from engine.proc import git, git_blob, git_objects
from engine.project_files import readable_in
from resources.base import SYSTEM, names

KIND = names("edited", "created", "deleted")
EDITED = "edited"
EMPTY_BLOB = "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"
SNAPSHOT = "files"


def change_kind(path: str, last: dict, now: dict) -> str:
    if path not in last:
        return KIND.created
    return KIND.deleted if path not in now else KIND.edited


def internal(record, project: Path, homes: tuple[str, ...]) -> tuple[str, ...]:
    roots = []
    for root in (record.root, record.root.resolve()):
        try:
            roots.append(str(root.relative_to(project)))
        except ValueError:
            try:
                roots.append(str(root.relative_to(project.resolve())))
            except ValueError:
                continue
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
REPOSITORIES: dict[Path, tuple[float, tuple[Path, ...]]] = {}
MOST_FOUND = 50
RESCAN_SECONDS = 300
REPOSITORY_DEPTH = 2
SKIPPED = {"node_modules", "vendor", "dist", "build"}
LINKED_REPOSITORY = "160000"
IMAGE_SUFFIXES = (".png", ".gif", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".bmp")


def is_image(path: str) -> bool:
    return path.lower().endswith(IMAGE_SUFFIXES)


def ignored_images(project: Path) -> list[str]:
    """The pictures git ignores, such as a project that ignores *.png: an agent still makes them, so its feed shows them."""
    wanted = [*(f"*{suffix}" for suffix in IMAGE_SUFFIXES), *(f":(exclude,glob)**/{name}/**" for name in SKIPPED)]
    return [path for path in git(["ls-files", "-o", "-i", "--exclude-standard", "-z", "--", *wanted], project).split("\0") if path]


def project_repositories(project: Path) -> tuple[Path, ...]:
    held = REPOSITORIES.get(project)
    if held and time.time() - held[0] < RESCAN_SECONDS:
        return held[1]
    own = (project,) if (project / ".git").exists() else ()
    found = (*own, *sorted(nested_repositories(project, REPOSITORY_DEPTH)))
    REPOSITORIES[project] = (time.time(), found)
    return found


def nested_repositories(folder: Path, depth: int) -> list[Path]:
    if depth == 0:
        return []
    try:
        children = [child for child in folder.iterdir() if child.is_dir() and not child.is_symlink() and not child.name.startswith(".") and child.name not in SKIPPED]
    except OSError:
        return []
    return [found for child in children for found in ([child] if (child / ".git").exists() else nested_repositories(child, depth - 1))]


def prefixed(project: Path, repository: Path, paths: dict) -> dict:
    prefix = "" if repository == project else f"{repository.relative_to(project).as_posix()}/"
    return {f"{prefix}{path}": value for path, value in paths.items()}


INDEX_FILES: dict[Path, Path] = {}


def index_stamp(project: Path) -> int:
    """When the repository's index last changed; where git keeps it is asked once, and again only when the index is not where it was."""
    where = INDEX_FILES.get(project)
    for asking in (where is None, True):
        if asking:
            where = INDEX_FILES[project] = project / git(["rev-parse", "--git-path", "index"], project).strip()
        try:
            return where.stat().st_mtime_ns
        except OSError:
            continue
    return 0


def tracked_in(project: Path) -> dict:
    stamp = index_stamp(project)
    held = INDEXES.get(project)
    if held is not None and held.stamp == stamp:
        return held.tree
    tree = {}
    for entry in git(["ls-files", "-s", "-z"], project).split("\0"):
        meta, _, path = entry.partition("\t")
        if path and not meta.startswith(LINKED_REPOSITORY):
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


def blobs(record, project: Path, homes: tuple[str, ...]) -> dict:
    marks = internal(record, project, homes)
    found = project_repositories(project)
    with ThreadPoolExecutor(max_workers=len(found) or 1) as pool:
        trees = list(pool.map(blobs_in, found))
    tree = {path: sha for repository, held in zip(found, trees) for path, sha in prefixed(project, repository, held).items()}
    return {path: sha for path, sha in tree.items() if not journals_own(path, marks) and readable_in(project, path)}


def blobs_in(project: Path) -> dict:
    tree = dict(tracked_in(project))
    dirty = list(dict.fromkeys(p for p in [*git(["ls-files", "-m", "-o", "-d", "--exclude-standard", "-z"], project).split("\0"), *ignored_images(project)] if p))
    present = [p for p in dirty if readable_in(project, p) and (project / p).is_file()]
    UNTRACKED[project] = tuple(p for p in present if p not in tree)
    for path in set(dirty) - set(present):
        tree.pop(path, None)
    tree.update(hashed(project, present))
    return tree


def blob_bytes(project: Path, sha: str) -> bytes | None:
    return next((found for repository in project_repositories(project) if (found := git_blob(repository, sha)) is not None), None)


def blob_texts(project: Path, shas: list[str]) -> dict[str, str]:
    texts = {EMPTY_BLOB: ""}
    for repository in project_repositories(project):
        wanted = [sha for sha in dict.fromkeys(shas) if sha not in texts]
        if not wanted:
            break
        texts.update(git_objects(repository, wanted))
    return texts


def project_paths(project: Path) -> set[str]:
    return {path for repository in project_repositories(project) for path in prefixed(project, repository, dict.fromkeys(paths_in(repository))) if readable_in(project, path)}


def paths_in(project: Path) -> set[str]:
    if project not in UNTRACKED:
        UNTRACKED[project] = tuple(p for p in git(["ls-files", "-o", "--exclude-standard", "-z"], project).split("\0") if p)
    return {*tracked_in(project), *UNTRACKED[project]}


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
    return {(before, after): LineCount.between(texts.get(before, ""), texts.get(after, "")) for before, after in pairs}


class Coalesced:
    def __init__(self):
        self.guard = threading.Lock()
        self.running: set = set()
        self.again: dict = {}

    def run(self, key, job) -> None:
        with self.guard:
            if key in self.running:
                self.again[key] = job
                return
            self.running.add(key)
        try:
            while job is not None:
                job()
                with self.guard:
                    job = self.again.pop(key, None)
                    if job is None:
                        self.running.discard(key)
        except Exception:
            with self.guard:
                self.again.pop(key, None)
                self.running.discard(key)
            raise


ANNOUNCING = Coalesced()


def checkout_of(record, cwd: str) -> Path:
    """The git checkout an agent works in when it is not the project's own: a linked worktree or a repository of its own inside a project that is a repository."""
    project = record.root.parent
    top = git(["rev-parse", "--show-toplevel"], cwd).strip() if cwd and Path(cwd).is_dir() and (project / ".git").exists() else ""
    return Path(top).resolve() if top and Path(top).resolve() != project.resolve() else project


def snapshot_name(record, folder: Path) -> str:
    project = record.root.parent
    return SNAPSHOT if folder in (project, project.resolve()) else f"{SNAPSHOT}-{folder.name}"


ANNOUNCE_AFTER = 2.0
LOOK_SPACING = 5.0
LOOKED: dict[tuple, float] = {}
PENDING: set[tuple] = set()


def announce_writes(record, agent: int, homes: tuple[str, ...], cwd: str = "") -> None:
    """Looks at what the writes changed once, a moment after the last of them: a burst of writes asks for one look, and the hook that asked is not held up by it; a look that took long is followed by one only after five times as long, so a big project is never looked at more than a sixth of the time."""
    folder = checkout_of(record, cwd)
    key = (str(record.root), record.env, str(folder))

    def look() -> None:
        with ANNOUNCING.guard:
            PENDING.discard(key)
        began = time.monotonic()
        ANNOUNCING.run(key, lambda: announce(record, agent, homes, folder))
        LOOKED[key] = time.monotonic() - began
    if not bus.BACKGROUND:
        look()
        return
    with ANNOUNCING.guard:
        if key in PENDING:
            return
        PENDING.add(key)
    timer = threading.Timer(max(ANNOUNCE_AFTER, LOOK_SPACING * LOOKED.get(key, 0.0)), look)
    timer.daemon = True
    timer.start()


def announce(record, agent: int, homes: tuple[str, ...], folder: Path) -> None:
    project = folder
    now = blobs(record, project, homes)
    with record.state(snapshot_name(record, folder)).changing() as held:
        last = held.get("tree")
        held["tree"] = now
    if last is None:
        return
    last = {path: sha for path, sha in last.items() if readable_in(project, path)}
    at = time.time()
    changed = {path: (last.get(path, EMPTY_BLOB), now.get(path, EMPTY_BLOB)) for path in sorted(set(last) | set(now)) if last.get(path) != now.get(path)}
    counts = line_counts(project, [pair for path, pair in changed.items() if not is_image(path)])
    for path, (before, after) in changed.items():
        count = counts.get((before, after), LineCount(0, 0))
        bus.announce(record, "file", agent, EDITED, SYSTEM, {"at": at, "path": path, "kind": change_kind(path, last, now), "before": before,
                                                            "after": after, "added": count.added, "removed": count.removed}, at=at)
