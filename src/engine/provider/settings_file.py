from dataclasses import dataclass
from pathlib import Path

READONLY_MODE = 0o444


@dataclass(frozen=True)
class SettingsFile:
    """One file the journal owns for an agent program: where it goes, its whole text and its permission bits."""

    path: Path
    text: str
    mode: int = READONLY_MODE

    @property
    def data(self) -> bytes:
        return self.text.encode()
