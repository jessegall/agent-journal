import mimetypes
from pathlib import Path


class StaticFiles:
    """The built viewer, served at the root; any path that is not a file is the app's own page, so its routes work on a reload."""

    def __init__(self, folder: Path) -> None:
        self.folder = folder

    def serve(self, path: str) -> tuple[int, str, bytes] | None:
        if not self.folder.is_dir():
            return None
        wanted = (self.folder / path.lstrip("/")).resolve()
        if not str(wanted).startswith(str(self.folder.resolve())) or not wanted.is_file():
            wanted = self.folder / "index.html"
        if not wanted.is_file():
            return None
        kind = mimetypes.guess_type(str(wanted))[0] or "application/octet-stream"
        return 200, kind, wanted.read_bytes()
