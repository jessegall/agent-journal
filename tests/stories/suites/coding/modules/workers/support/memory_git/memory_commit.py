from dataclasses import dataclass


@dataclass(frozen=True)
class MemoryCommit:
    """One commit of an in-memory repository: its id, its parents, the text of every file it holds and its message."""

    id: str
    parents: tuple[str, ...]
    tree: dict[str, str]
    message: str
