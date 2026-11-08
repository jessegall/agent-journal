from dataclasses import dataclass

from core.base.command.command import Command
from core.base.provider.managed_hook import ManagedHook


@dataclass(frozen=True)
class RemoveManagedHooks(Command[list[ManagedHook]]):
    """Removes every managed hook whose command carries the stamp."""

    stamp: str
