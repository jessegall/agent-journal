from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class StopUnusedLauncher(Command[None]):
    """Tells the person once that a second launcher ran beside the one that serves the journal, and stops it.
    It takes no write lock while it waits for the process to go."""

    lock = False

    serving_pid: int
    unused_pid: int
