from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class ScanManagedHooks(Command[int]):
    """Imports project hooks from every installed program's files."""
