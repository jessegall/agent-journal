from dataclasses import dataclass


@dataclass(frozen=True)
class AttachedFile:
    """A file attached to a row, as the Documents page's files list shows it."""

    row: str
    title: str
    name: str
    description: str
    size: int
    time: float
    image: bool
    url: str

    def matches(self, words: list[str]) -> bool:
        text = f"{self.name} {self.description} {self.title} {self.row}".lower()
        return all(word in text for word in words)
