import os
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Config:
    root: Path
    port: int = 8420
    """The first port to try; the server takes the first free one of `span` from it, so journals of many projects run side by side."""
    span: int = 20

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
    def readers(self) -> Path:
        """The project's output readers, kept in its journal so they travel with it."""
        return self.home / "readers"

    @property
    def port_file(self) -> Path:
        return self.home / "port"

    def ports(self) -> tuple[int, ...]:
        """The ports to try in order: the one this project had last, then the range; 0 means any free port."""
        if self.port == 0:
            return (0,)
        return tuple(dict.fromkeys((*self.remembered_port(), *range(self.port, self.port + self.span))))

    def remembered_port(self) -> tuple[int, ...]:
        if not self.port_file.is_file():
            return ()
        text = self.port_file.read_text().strip()
        return (int(text),) if text.isdigit() else ()

    @classmethod
    def at(cls, root: Path) -> "Config":
        """JOURNAL_PORT names one exact port; without it the range from 8420 is tried, and 0 takes any free one."""
        if "JOURNAL_PORT" in os.environ:
            return cls(root.resolve(), int(os.environ["JOURNAL_PORT"]), span=1)
        return cls(root.resolve())
