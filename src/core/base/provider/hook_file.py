from collections.abc import Mapping
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class HookFile:
    """Where a program reads its hooks, relative to the folder it runs in, and the values each hook entry carries
    beside the command."""

    path: Path
    entry_values: Mapping[str, object]
