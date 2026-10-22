from dataclasses import dataclass


@dataclass(frozen=True)
class ChangedFile:
    """A file a part of a shell line changed, as git counts it: lines added, lines removed, and its path; a new file counts its lines as added."""

    added: int
    removed: int
    path: str
