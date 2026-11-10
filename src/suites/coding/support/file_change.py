from collections.abc import Mapping
from dataclasses import dataclass

from engine.driver.diff_count import DiffCount


@dataclass(frozen=True)
class FileChange:
    """One file a file scan found changed: its line counts and its rows."""

    diff: DiffCount
    rows: tuple[Mapping[str, object], ...]
