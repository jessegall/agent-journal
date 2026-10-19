from dataclasses import dataclass


@dataclass(frozen=True)
class ChangelogPage:
    """Some releases of the changelog: their text, how many releases have been shown by its end, and whether older ones follow."""

    text: str
    shown: int
    more: bool
