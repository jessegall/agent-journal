import os
import stat
from dataclasses import dataclass
from pathlib import Path

from suites.coding.support.shell_read_budget import ShellReadBudget


@dataclass(frozen=True)
class ShellFileState:
    """A regular text file within the hook's read budget, or an absent file."""

    existed: bool
    lines: tuple[str, ...]

    @classmethod
    def read(cls, path: Path, budget: ShellReadBudget) -> "ShellFileState | None":
        try:
            descriptor = os.open(path, os.O_RDONLY | os.O_NONBLOCK)
        except FileNotFoundError:
            return cls(False, ())
        with os.fdopen(descriptor, "rb", buffering=0) as handle:
            info = os.fstat(handle.fileno())
            if not stat.S_ISREG(info.st_mode) or info.st_size > budget.bytes_left:
                return None
            content = handle.read(budget.bytes_left)
            budget.bytes_left -= len(content)
            if os.fstat(handle.fileno()).st_size > len(content) or b"\0" in content:
                return None
        lines = tuple(content.decode(errors="replace").splitlines(keepends=True))
        if len(lines) > budget.lines_left:
            return None
        budget.lines_left -= len(lines)
        return cls(True, lines)
