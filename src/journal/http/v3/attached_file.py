from dataclasses import dataclass


@dataclass(frozen=True)
class AttachedFile:
    """A file attached to a row, as the Documents page's files list shows it."""

    type: str
    n: int
    title: str
    name: str
    description: str
    size: int
    at: float
    image: bool
    url: str

    def matches(self, words: list[str]) -> bool:
        """Whether every word searched is in its name, its description, its row's title, its kind or its number."""
        text = f"{self.name} {self.description} {self.title} {self.type} {self.n}".lower()
        return all(word in text for word in words)
