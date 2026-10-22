from dataclasses import dataclass


@dataclass(frozen=True)
class EndedOutput:
    """A command that ended in the background, by its output's number and how it ended."""

    id: int
    ending: str
