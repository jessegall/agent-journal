import mimetypes
from enum import StrEnum
from pathlib import Path
from typing import TypedDict
from urllib.parse import quote

from controllers.types import CONTROLLERS
from engine.paths import contained
from resources.base import AGENT, USER
from engine.memo import Memo

ATTACHED = Memo()


def listed_types() -> list[str]:
    return [t for t, c in CONTROLLERS.items() if tuple(c.resource.notified) != (AGENT,)]


class AttachedFile(TypedDict):
    type: str
    n: int
    title: str
    name: str
    description: str
    size: int
    at: float
    image: bool
    url: str


def attached_file(record, type_: str, r, name: str, f: Path) -> AttachedFile:
    return {"type": type_, "n": r.n, "title": r.title, "name": name, "description": r.files.get(name, ""), "size": f.stat().st_size,
            "at": f.stat().st_mtime, "image": (mimetypes.guess_type(name)[0] or "").startswith("image/"),
            "url": f"/api/{record.env}/{type_}/{r.n}/files/{quote(name, safe='')}"}


def listed_attachments(record, type_: str, controller) -> list[AttachedFile]:
    files = []
    for row in controller._attached():
        folder = controller.folder(row.n)
        for name in row.files:
            file = contained(folder, name)
            if file.is_file():
                files.append(attached_file(record, type_, row, name, file))
    return files


def attachments(record) -> list[AttachedFile]:
    controllers = [(type_, CONTROLLERS[type_](record, actor=USER)) for type_ in listed_types()]
    summaries = tuple(c.rows.summaries() for _, c in controllers)
    return ATTACHED.get(str(record.home), summaries,
                        lambda: sorted((f for type_, c in controllers for f in listed_attachments(record, type_, c)), key=lambda x: -x["at"]))


FILES_PAGE = 60


class FileKind(StrEnum):
    ALL = "all"
    IMAGES = "images"
    OTHER = "other"

    def holds(self, file: AttachedFile) -> bool:
        return self is FileKind.ALL or file["image"] is (self is FileKind.IMAGES)


def matches(file: AttachedFile, words: list[str]) -> bool:
    kind = CONTROLLERS[file["type"]].resource.title
    text = f"{file['name']} {file['description']} {file['title']} {kind} {file['n']}".lower()
    return all(word in text for word in words)


def attachments_page(record, kind: FileKind = FileKind.ALL, shelf: str | None = None, search: str = "", last: int = FILES_PAGE, skip: int = 0) -> dict:
    """One page of the attached files, newest first, filtered on the server by kind (images or other), by what they are attached to and by the words searched; the counts cover the whole set."""
    every = attachments(record)
    shown = [f for f in every if FileKind(kind).holds(f)]
    shelves: dict[str, int] = {}
    for f in shown:
        shelves[f["type"]] = shelves.get(f["type"], 0) + 1
    words = search.lower().split()
    found = [f for f in shown if (shelf is None or f["type"] == shelf) and matches(f, words)]
    return {"files": found[skip:skip + last], "more": len(found) > skip + last, "found": len(found),
            "counts": {"all": len(every), "images": sum(f["image"] for f in every), "other": sum(not f["image"] for f in every), "shelves": shelves}}
