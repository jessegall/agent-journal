from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class ScanManagedHooks(Command[int]):
    """Imports project hooks from every installed program's files."""
