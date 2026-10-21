from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class PluginsData:
    """The plugins feature's reading: the project root and the folder the installed plugins live in, both resolved."""

    root: Path
    plugins_folder: Path

    def blocks(self, path: str) -> bool:
        return (self.root / Path(path).expanduser()).resolve().is_relative_to(self.plugins_folder)
