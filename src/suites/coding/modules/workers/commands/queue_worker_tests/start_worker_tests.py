from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class StartWorkerTests(Command[None]):
    """Starts the next queued test of each worker the setting has room for, one test at a time per worker."""

