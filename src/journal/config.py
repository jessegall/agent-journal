from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Config:
    root: Path
    port: int = 8420

    @property
    def database(self) -> Path: ...

    @classmethod
    def at(cls, root: Path) -> "Config": ...
