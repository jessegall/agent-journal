from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class PruneHookCalls(Command[int]):
    """Deletes hook calls older than the setting drivers.hook-call-days, with the lines they gave."""
