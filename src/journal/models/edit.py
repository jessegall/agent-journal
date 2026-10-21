from dataclasses import dataclass

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Edit(Scoped):
    """One change an agent made to a file: by a tool with its changed lines, or by a shell command with its counts alone. Kept as rows so the file edits pane shows the same after a return."""

    session: str = ""
    path: str = ""
    kind: str = "edit"
    at: float = 0.0
    added: int = 0
    removed: int = 0
    first_line: int = 1
    last_line: int = 1
    rows: tuple = ()
    command: str = ""
    tool_use: int = 0
