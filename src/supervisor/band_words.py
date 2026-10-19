from dataclasses import dataclass


@dataclass(frozen=True)
class BandWords:
    """The band's words: one on the left, one in the middle, one on the right."""

    left: str
    middle: str
    right: str
