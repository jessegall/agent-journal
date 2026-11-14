import json
import sys
from collections.abc import Generator
from contextlib import contextmanager
from pathlib import Path
from types import FrameType

from engine.file.file_access import FileAccess
from engine.module.source_hash import SourceHash

TOUCHED_FILE = "touched-code.json"
OUTSIDE_FOLDERS = frozenset((".venv", "node_modules", "site-packages"))


class TouchedCode:
    """The source files whose code a template's build ran, with a hash of each, kept beside the template. A
    template is used again only while every one of those files is as it was, so editing code its build never
    ran leaves it warm."""

    def __init__(self, checkout: Path) -> None:
        self.checkout = checkout
        self.names: set[str] = set()

    @contextmanager
    def recording(self) -> Generator[None]:
        previous = sys.getprofile()
        sys.setprofile(self.note_call)
        try:
            yield
        finally:
            sys.setprofile(previous)

    def note_call(self, frame: FrameType, event: str, argument: object) -> None:
        if event == "call":
            self.names.add(frame.f_code.co_filename)

    def hashes(self) -> dict[str, str]:
        hashes: dict[str, str] = {}
        for name in self.names:
            path = Path(name)
            is_source = path.is_absolute() and path.is_relative_to(self.checkout) and not OUTSIDE_FOLDERS.intersection(path.parts)
            content = SourceHash.file_hash(path) if is_source else None
            if content is not None:
                hashes[path.relative_to(self.checkout).as_posix()] = content.hex()
        return hashes

    def write(self, folder: Path, inherited: Path | None) -> None:
        hashes = self.hashes()
        if inherited is not None:
            hashes.update(self.read(inherited))
        FileAccess.write(folder / TOUCHED_FILE, json.dumps(hashes, sort_keys=True))

    @staticmethod
    def read(folder: Path) -> dict[str, str]:
        file = folder / TOUCHED_FILE
        return json.loads(FileAccess.read(file)) if FileAccess.is_file(file) else {}

    def is_unchanged(self, folder: Path) -> bool:
        touched = self.read(folder)
        return all((content := SourceHash.file_hash(self.checkout / name)) is not None and content.hex() == recorded for name, recorded in touched.items())
