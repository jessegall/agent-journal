from pathlib import Path

from sync_server.file_place import FilePlace
from sync_server.refusal import Refusal

LIMIT_BYTES = 50 * 1024 * 1024


class FileStore:
    """The files attached to the team's rows, kept in the data folder under the row's table, number and the file's name, which are the same on every machine."""

    def __init__(self, folder: Path) -> None:
        self.folder = folder

    def put(self, place: FilePlace, data: bytes) -> int:
        if len(data) > LIMIT_BYTES:
            raise Refusal(f"a file of {len(data) // (1024 * 1024)} MB is over the team server's limit of {LIMIT_BYTES // (1024 * 1024)} MB")
        target = place.checked().folder_path(self.folder)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        return len(data)

    def get(self, place: FilePlace) -> bytes:
        source = place.checked().folder_path(self.folder)
        if not source.is_file():
            raise Refusal(f"the team server holds no file {place.name} of {place.row_table} {place.row}")
        return source.read_bytes()
