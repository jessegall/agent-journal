import shlex
from pathlib import Path

TEXT = """#!/bin/sh
# This project's journal command: nothing is installed outside the project. The supervisor puts this folder on the agent's PATH.
JOURNAL_ROOT={root} exec sh {shim} "$@"
"""


class ProjectCommand:
    """The project's own journal command at .journal/bin/journal, written by setup and by every launch, so it is there whichever came first."""

    def __init__(self, root: Path, shim: Path) -> None:
        self.root, self.shim = root, shim

    @property
    def path(self) -> Path:
        return self.root / ".journal" / "bin" / "journal"

    def write(self) -> Path:
        text = TEXT.format(root=shlex.quote(str(self.root)), shim=shlex.quote(str(self.shim)))
        self.path.parent.mkdir(parents=True, exist_ok=True)
        if not self.path.is_file() or self.path.read_text() != text:
            self.path.write_text(text)
            self.path.chmod(0o755)
        return self.path
