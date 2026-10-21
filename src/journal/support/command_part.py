from dataclasses import dataclass


@dataclass(frozen=True)
class CommandPart:
    """One command of a shell line as the journal read it before it ran: its text, whether it is a journal command, whether it writes, the files it will touch, written or printed, and whether it reads a kept output by hand, with the shape of that read, the output's number taken out, so two reads of the same kind look alike."""

    text: str
    is_journal: bool
    writes: bool
    files: tuple[str, ...]
    reads_output: bool
    read_shape: str
