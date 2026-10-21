from dataclasses import dataclass


@dataclass(frozen=True)
class CommandPart:
    """One command of a shell line as the journal read it before it ran: its text, whether it is a journal command, whether it writes, and the files it will touch, written or printed."""

    text: str
    is_journal: bool
    writes: bool
    files: tuple[str, ...]
