from dataclasses import dataclass
from pathlib import Path
from urllib.parse import quote, unquote

from sync_server.refusal import Refusal

TABLES = ("messages", "dumps")


@dataclass(frozen=True)
class FilePlace:
    """Where an attached file belongs: its row's table and number and its name, the same on every machine."""

    row_table: str
    row: int
    name: str

    @classmethod
    def parsed(cls, path: str) -> "FilePlace":
        parts = path.split("/")
        if len(parts) != 3 or not parts[1].isdigit():
            raise Refusal(f"no such file place: {path}")
        return cls(parts[0], int(parts[1]), unquote(parts[2])).checked()

    def checked(self) -> "FilePlace":
        if self.row_table not in TABLES or not self.name or Path(self.name).name != self.name:
            raise Refusal(f"no such file place: {self.row_table}/{self.row}/{self.name}")
        return self

    def address(self) -> str:
        return f"{self.row_table}/{self.row}/{quote(self.name)}"

    def folder_path(self, folder: Path) -> Path:
        return folder / self.row_table / str(self.row) / self.name
