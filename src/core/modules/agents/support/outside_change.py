from dataclasses import dataclass


@dataclass(frozen=True)
class OutsideChange:
    """A change to one of the journal's own settings files or links made outside the journal: the mark's key and
    the words that say what was put back."""

    key: str
    text: str
