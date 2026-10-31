from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class HookCallPrune(Command[int]):
    """Deletes hook calls older than the setting drivers.hook-call-days, with the lines they gave."""
