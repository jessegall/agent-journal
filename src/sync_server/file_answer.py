from dataclasses import dataclass


@dataclass(frozen=True)
class FileAnswer:
    """How many bytes of a file the team server kept."""

    size: int
