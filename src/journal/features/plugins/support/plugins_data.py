from dataclasses import dataclass
from pathlib import Path



@dataclass(frozen=True)
class PluginsData:
    """The plugins feature's reading: the project root and the folder the installed plugins live in, both resolved."""

    root: Path
    plugins_folder: Path
