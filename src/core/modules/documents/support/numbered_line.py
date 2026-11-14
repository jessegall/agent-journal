from dataclasses import dataclass


@dataclass(frozen=True)
class NumberedLine:
    """A line of a text and its number, counted from 1."""

    number: int
    text: str
