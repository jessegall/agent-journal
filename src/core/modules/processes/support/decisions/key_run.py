from dataclasses import dataclass

from core.modules.processes.models.enums.reader_state import ReaderState


@dataclass(frozen=True)
class KeyRun:
    """One ended run of a command as the count sees it: the state decided at its end, and whether its count was
    reset after it."""

    state: ReaderState
    reset_after: bool
