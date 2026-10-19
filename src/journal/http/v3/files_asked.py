from dataclasses import dataclass

from journal.http.v3.attached_file import AttachedFile


@dataclass(frozen=True)
class FilesAsked:
    """What the files list asks for: images, other files or all, those attached to one kind of row, the words searched, and which page."""

    kind: str = "all"
    shelf: str = ""
    search: str = ""
    last: int = 60
    skip: int = 0

    @classmethod
    def from_query(cls, query: dict) -> "FilesAsked":
        words = {name: query[name] for name in ("kind", "shelf", "search") if query.get(name)}
        numbers = {name: int(query[name]) for name in ("last", "skip") if query.get(name)}
        return cls(**words, **numbers)

    def holds(self, file: AttachedFile) -> bool:
        """Whether the file is of the kind asked, attached to the row kind asked, and holds every word searched."""
        kind = self.kind == "all" or file.image is (self.kind == "images")
        return kind and (not self.shelf or file.type == self.shelf) and file.matches(self.search.lower().split())
