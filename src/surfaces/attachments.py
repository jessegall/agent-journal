import mimetypes
from pathlib import Path
from typing import TypedDict
from urllib.parse import quote

from controllers.types import CONTROLLERS
from engine.paths import contained
from resources.base import AGENT, USER

ATTACHED: dict[str, tuple] = {}


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
    summaries = [c.summaries() for _, c in controllers]
    held = ATTACHED.get(str(record.home))
    if held and all(a is b for a, b in zip(held[0], summaries, strict=True)):
        return held[1]
    out = []
    for type_, c in controllers:
        out.extend(listed_attachments(record, type_, c))
    files = sorted(out, key=lambda x: -x["at"])
    ATTACHED[str(record.home)] = (summaries, files)
    return files
