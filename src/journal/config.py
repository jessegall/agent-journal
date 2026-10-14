from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Config:
    root: Path
    port: int = 8420

    @property
    def home(self) -> Path:
        return self.root / ".journal"

    @property
    def database(self) -> Path:
        return self.home / "journal.db"

    @property
    def port_file(self) -> Path:
        return self.home / "port"

    @classmethod
    def at(cls, root: Path) -> "Config":
        return cls(root.resolve())
