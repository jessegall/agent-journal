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
        except (FileNotFoundError, NotADirectoryError):
            return cls(False, ())
        file_stat = os.fstat(descriptor)
        if not stat.S_ISREG(file_stat.st_mode):
            os.close(descriptor)
            return None
        with os.fdopen(descriptor, "rb", buffering=0) as handle:
            if file_stat.st_size > budget.remaining_bytes:
                return None
            content = handle.read(budget.remaining_bytes)
            budget.consume_bytes(len(content))
            if os.fstat(handle.fileno()).st_size > len(content) or b"\0" in content:
                return None
        lines = tuple(content.decode(errors="replace").splitlines(keepends=True))
        if not budget.accept_lines(len(lines)):
            return None
        return cls(True, lines)
