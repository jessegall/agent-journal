from dataclasses import dataclass


@dataclass(frozen=True)
class LibraryHit:
    """One item of the team's library that a search found: its share, number, title and the text around the match."""

    share: str
    item_id: int
    title: str
    excerpt: str
