import mimetypes
from pathlib import Path

from journal.config import Config

FOLDERS = {"messages": "message", "dumps": "dump"}


class Attachments:
    """The files attached to messages and dumps, kept under .journal/files/<folder>/<id>/, named as they came."""

    def __init__(self, config: Config) -> None:
        self.home = config.files

    def store(self, table: str, id: int, name: str, data: bytes) -> str:
        safe = Path(name).name or "file"
        folder = self.home / FOLDERS[table] / str(id)
        folder.mkdir(parents=True, exist_ok=True)
        (folder / safe).write_bytes(data)
        return safe

    def path(self, table: str, id: int, name: str) -> Path:
        return self.home / FOLDERS[table] / str(id) / Path(name).name

    def read(self, table: str, id: int, name: str) -> tuple[str, bytes] | None:
        if table not in FOLDERS:
            return None
        path = self.path(table, id, name)
        if not path.is_file():
            return None
        return mimetypes.guess_type(path.name)[0] or "application/octet-stream", path.read_bytes()
