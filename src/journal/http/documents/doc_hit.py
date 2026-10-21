from typing import TypedDict


class DocHit(TypedDict):
    """A document that holds every word searched for: how well it matches, where the words are, and the passage around them."""

    id: int
    score: int
    place: str
    text: str
