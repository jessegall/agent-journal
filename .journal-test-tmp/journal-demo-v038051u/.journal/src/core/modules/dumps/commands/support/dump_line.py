from dataclasses import dataclass


@dataclass(frozen=True)
class DumpLine:
    """The line a move of a dump item answers."""

    text: str
