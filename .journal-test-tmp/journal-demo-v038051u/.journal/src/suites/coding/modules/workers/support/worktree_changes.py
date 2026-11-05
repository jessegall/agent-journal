from dataclasses import dataclass


@dataclass(frozen=True)
class WorktreeChanges:
    """The base commit and changed files used to judge a worker's changes."""

    base: str
    files: tuple[str, ...]
