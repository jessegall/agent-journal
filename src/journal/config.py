import os
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
    def status_home(self) -> Path:
        """Where the statusline script keeps each session's context figure."""
        return Path.home() / ".journal" / "status"

    @property
    def port_file(self) -> Path:
        return self.home / "port"

    @classmethod
    def at(cls, root: Path) -> "Config":
        """JOURNAL_PORT picks the port; 0 takes a free one, which the port file then names."""
        return cls(root.resolve(), int(os.environ.get("JOURNAL_PORT", cls.port)))
