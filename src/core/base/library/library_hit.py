from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class LibraryHit:
    """One item of the team's library that a search found: its share, number, title and the text around the match."""

    share: str
    item_id: int
    title: str
    excerpt: str

    def line(self) -> str:
        text = self.excerpt.removeprefix(self.title).lstrip(". ")
        return f"library {self.share} {self.item_id}: {self.title} {text}".rstrip()

    def json(self) -> Mapping[str, object]:
        return {"cli_name": f"library {self.share}", "id": self.item_id, "title": self.title, "excerpt": self.excerpt}
