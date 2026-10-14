from dataclasses import dataclass


@dataclass(frozen=True)
class CommitsAsked:
    """What a read of the project's commits asks for: those made since a moment, at most so many when a limit is named, read within so many seconds."""

    since: float
    most: int = 0
    timeout: float = 5.0
