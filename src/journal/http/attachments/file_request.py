from dataclasses import dataclass

from journal.http.attachments.attached_file import AttachedFile


@dataclass(frozen=True)
class FileRequest:
    """What the files list asks for: images, other files or all, those attached to one kind of row, such as messages, the words searched, and which page."""

    kind: str = "all"
    shelf: str = ""
    search: str = ""
    last: int = 60
    offset: int = 0

    @classmethod
    def query_request(cls, query: dict) -> "FileRequest":
        default = cls()
        return cls(query.get("kind", default.kind), query.get("shelf", default.shelf), query.get("search", default.search), int(query.get("last", default.last)), int(query.get("skip", default.offset)))

    def contains(self, file: AttachedFile) -> bool:
        kind = self.kind == "all" or file.image is (self.kind == "images")
        return kind and (not self.shelf or file.row.startswith(f"{self.shelf}:")) and file.matches(self.search.lower().split())
