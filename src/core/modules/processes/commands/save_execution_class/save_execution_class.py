from dataclasses import dataclass

from engine.command.command import Command
from engine.execution.execution_class import ExecutionClass


@dataclass(frozen=True)
class SaveExecutionClass(Command[str]):
    """Keeps a class the person added, or the person's change to a built-in class, for the next line it holds."""

    execution_class: ExecutionClass
    is_override: bool
