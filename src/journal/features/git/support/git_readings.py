from dataclasses import dataclass


@dataclass(frozen=True)
class GitReadings:
    """The git feature's reading: the files changed in the project and not committed, as git names them, at most twenty, or none."""

    uncommitted: str
