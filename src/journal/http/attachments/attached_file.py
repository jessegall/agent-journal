from dataclasses import dataclass


@dataclass(frozen=True)
class AttachedFile:
    """A file attached to a row, as the Documents page's files list shows it."""

    row: str
    """The row it is attached to, as messages:12."""
    title: str
    name: str
    description: str
    size: int
    at: float
    image: bool
    url: str

    def matches(self, words: list[str]) -> bool:
        """Whether every word searched is in its name, its description, its row's title or the row it is attached to."""
        text = f"{self.name} {self.description} {self.title} {self.row}".lower()
        return all(word in text for word in words)
