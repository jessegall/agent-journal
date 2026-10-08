import hashlib
from dataclasses import dataclass, field
from pathlib import Path

from engine import attic
from engine.paths import ENVIRONMENTS
from engine.proc import git
from engine.snapshots import never_travels, repositories
from engine.sync import travelling_files


@dataclass(frozen=True)
class Listing:
    """What a copy of the record holds: each file that travels by its path from the root and its digest, and the environments it moved to the attic."""

    files: dict[str, str]
    attic: frozenset[str]
    committed: dict[str, str] = field(default_factory=dict)
    heads: frozenset[str] = frozenset()

    @classmethod
    def of(cls, root: Path) -> "Listing":
        found = travelling_files(root)
        files = {path.relative_to(root).as_posix(): hashlib.sha1(path.read_bytes()).hexdigest() for path in found}
        archived = frozenset(attic.STAMPED.sub("", archive.name[:-len(attic.SUFFIX)]) for archive in attic.folder(root).glob(f"*{attic.SUFFIX}"))
        return cls({path: digest for path, digest in files.items() if not path.startswith(f"{attic.folder(root).name}/")}, archived)


    @classmethod
    def of_project(cls, project: Path) -> "Listing":
        """The project's files as git hashes them, with what each repository committed at its head: an edit is a file that differs from the head it stands on."""
        files, committed, heads = {}, {}, set()
        for repository in repositories(project):
            top, prefix = project / repository, "" if repository == "." else f"{repository}/"
            heads.add(f"{prefix or '.'}@{git(['rev-parse', 'HEAD'], top).strip()}")
            tree = (line.partition("\t") for line in git(["ls-tree", "-r", "HEAD"], top, 30).splitlines())
            committed.update({f"{prefix}{path}": facts.split()[2] for facts, _, path in tree})
            for path in git(["ls-files", "-z", "--cached", "--others", "--exclude-standard"], top, 30).split("\0"):
                if path and (top / path).is_file() and not never_travels(f"{prefix}{path}"):
                    files[f"{prefix}{path}"] = git(["hash-object", "--", path], top).strip()
        return cls(files, frozenset(), committed, frozenset(heads))

    def edited(self, path: str) -> bool:
        return self.files.get(path) != self.committed.get(path)


@dataclass(frozen=True)
class Differences:
    """What happened between two listings: files added, changed, removed or renamed, and ones that left with an environment moved to the attic."""

    added: tuple[str, ...] = ()
    changed: tuple[str, ...] = ()
    removed: tuple[str, ...] = ()
    renamed: tuple[tuple[str, str], ...] = ()
    archived: tuple[str, ...] = ()
    switched: bool = False


def archived_with(path: str, environments: frozenset[str]) -> bool:
    parts = path.split("/")
    return parts[0] == ENVIRONMENTS and len(parts) > 1 and parts[1] in environments


def compare(before: Listing, after: Listing) -> Differences:
    """What changed between two listings, counting only files someone edited: a file that is just what its repository's head holds on both sides moved with a branch switch, which is told apart in `switched`."""
    touched = {path for path in {*before.files, *after.files} if before.edited(path) or after.edited(path)}
    gone = {path: digest for path, digest in before.files.items() if path in touched and path not in after.files}
    new = {path: digest for path, digest in after.files.items() if path in touched and path not in before.files}
    renamed, unclaimed = [], dict(sorted(new.items()))
    for old, digest in sorted(gone.items()):
        target = next((path for path, found in unclaimed.items() if found == digest), "")
        if target:
            del unclaimed[target]
            renamed.append((old, target))
    moved_from, moved_to = {old for old, _ in renamed}, {path for _, path in renamed}
    leaving = tuple(sorted(path for path in gone if path not in moved_from and archived_with(path, after.attic)))
    return Differences(
        added=tuple(sorted(path for path in new if path not in moved_to)),
        changed=tuple(sorted(path for path, digest in after.files.items() if path in touched and path in before.files and before.files[path] != digest)),
        removed=tuple(sorted(path for path in gone if path not in moved_from and path not in leaving)),
        renamed=tuple(renamed),
        archived=leaving,
        switched=before.heads != after.heads,
    )
