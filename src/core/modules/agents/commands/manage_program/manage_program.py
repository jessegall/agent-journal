from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class ManageProgram(Command[int]):
    """Imports a program's project command hooks into the shared managed store."""

    lock = False

    program: str
    folder: str
