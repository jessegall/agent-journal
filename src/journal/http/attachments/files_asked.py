from dataclasses import dataclass

from journal.http.attachments.attached_file import AttachedFile


@dataclass(frozen=True)
class FilesAsked:
    """What the files list asks for: images, other files or all, those attached to one kind of row, such as messages, the words searched, and which page."""

    kind: str = "all"
    shelf: str = ""
    search: str = ""
    last: int = 60
    skip: int = 0

    @classmethod
    def from_query(cls, query: dict) -> "FilesAsked":
        terms = {name: query[name] for name in ("kind", "shelf", "search") if query.get(name)}
        numbers = {name: int(query[name]) for name in ("last", "skip") if query.get(name)}
        return cls(**terms, **numbers)

    def holds(self, file: AttachedFile) -> bool:
        kind = self.kind == "all" or file.image is (self.kind == "images")
        return kind and (not self.shelf or file.row.startswith(f"{self.shelf}:")) and file.matches(self.search.lower().split())
