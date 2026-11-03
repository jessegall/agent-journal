from collections.abc import Mapping
from dataclasses import dataclass

from core.base.driver.diff_count import DiffCount


@dataclass(frozen=True)
class ShellFileChange:
    """One file a shell command changed: its line counts and the lines the file feed shows."""

    diff: DiffCount
    rows: tuple[Mapping[str, object], ...]
