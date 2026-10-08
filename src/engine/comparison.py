import hashlib
from dataclasses import dataclass
from pathlib import Path

from engine import attic
from engine.paths import ENVIRONMENTS
from engine.sync import travels


@dataclass(frozen=True)
class Listing:
    """What a copy of the record holds: each file that travels by its path from the root and its digest, and the environments it moved to the attic."""

    files: dict[str, str]
    attic: frozenset[str]

    @classmethod
    def of(cls, root: Path) -> "Listing":
        found = sorted(path for path in Path(root).rglob("*") if path.is_file() and travels(path.relative_to(root).as_posix()))
        files = {path.relative_to(root).as_posix(): hashlib.sha1(path.read_bytes()).hexdigest() for path in found}
        archived = frozenset(attic.STAMPED.sub("", archive.name[:-len(attic.SUFFIX)]) for archive in attic.folder(root).glob(f"*{attic.SUFFIX}"))
        return cls({path: digest for path, digest in files.items() if not path.startswith(f"{attic.folder(root).name}/")}, archived)


@dataclass(frozen=True)
class Differences:
    """What happened between two listings: files added, changed, removed or renamed, and ones that left with an environment moved to the attic."""

    added: tuple[str, ...] = ()
    changed: tuple[str, ...] = ()
    removed: tuple[str, ...] = ()
    renamed: tuple[tuple[str, str], ...] = ()
    archived: tuple[str, ...] = ()


def archived_with(path: str, environments: frozenset[str]) -> bool:
    parts = path.split("/")
    return parts[0] == ENVIRONMENTS and len(parts) > 1 and parts[1] in environments


def compare(before: Listing, after: Listing) -> Differences:
    gone = {path: digest for path, digest in before.files.items() if path not in after.files}
    new = {path: digest for path, digest in after.files.items() if path not in before.files}
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
        changed=tuple(sorted(path for path, digest in after.files.items() if path in before.files and before.files[path] != digest)),
        removed=tuple(sorted(path for path in gone if path not in moved_from and path not in leaving)),
        renamed=tuple(renamed),
        archived=leaving,
    )
