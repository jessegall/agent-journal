from dataclasses import dataclass

from engine.command.command import Command
from engine.provider.managed_hook import ManagedHook


@dataclass(frozen=True)
class RemoveManagedHooks(Command[list[ManagedHook]]):
    """Removes every managed hook whose command carries the stamp."""

    stamp: str
