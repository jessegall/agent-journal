from dataclasses import dataclass

from engine.command.command import Command
from core.modules.library.support.sync_outcome import SyncOutcome


@dataclass(frozen=True)
class RunLibrarySync(Command[SyncOutcome]):
    """Runs one sync round now: the copies are compared with the shared server's list."""

    lock = False
