import mimetypes
from pathlib import Path

from journal.config import Config


class Attachments:
    """The files attached to rows, kept under .journal/files/<type>/<n>/, named as they came."""

    def __init__(self, config: Config) -> None:
        self.home = config.home / "files"

    def store(self, type: str, n: int, name: str, data: bytes) -> str:
        safe = Path(name).name or "file"
        folder = self.home / type / str(n)
        folder.mkdir(parents=True, exist_ok=True)
        (folder / safe).write_bytes(data)
        return safe

    def path(self, type: str, n: int, name: str) -> Path:
        """Where a row's attached file is kept; a name is never more than a file's own name."""
        return self.home / type / str(n) / Path(name).name

    def read(self, type: str, n: int, name: str) -> tuple[str, bytes] | None:
        path = self.path(type, n, name)
        if not path.is_file():
            return None
        return mimetypes.guess_type(path.name)[0] or "application/octet-stream", path.read_bytes()
