import os
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Config:
    root: Path
    port: int = 8420
    span: int = 20

    @property
    def home(self) -> Path:
        return self.root / ".journal"

    @property
    def database(self) -> Path:
        return self.home / "journal.db"

    @property
    def status_home(self) -> Path:
        return Path.home() / ".journal" / "status"

    @property
    def files(self) -> Path:
        return self.home / "files"

    @property
    def readers(self) -> Path:
        return self.home / "readers"

    @property
    def port_file(self) -> Path:
        return self.home / "port"

    def ports(self) -> tuple[int, ...]:
        if self.port == 0:
            return (0,)
        return tuple(dict.fromkeys((*self.stored_port(), *range(self.port, self.port + self.span))))

    def stored_port(self) -> tuple[int, ...]:
        if not self.port_file.is_file():
            return ()
        text = self.port_file.read_text().strip()
        return (int(text),) if text.isdigit() else ()

    @classmethod
    def rooted(cls, root: Path) -> "Config":
        # an orchestrator may set JOURNAL_PORT for a service named journal (Kubernetes: tcp://10.43.195.65:80), so only a
        # port number is taken from it
        port = os.environ.get("JOURNAL_PORT", "")
        if port.isdigit():
            return cls(root.resolve(), int(port), span=1)
        return cls(root.resolve())
