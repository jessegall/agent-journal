from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.execution.builtin_classes import BUILTIN_CLASSES
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.processes.commands.remove_execution_class.remove_execution_class import RemoveExecutionClass
from core.modules.processes.models.execution_class_row import ExecutionClassRow

BUILTIN_NAMES = frozenset(row.execution_class.name for row in BUILTIN_CLASSES)


class RemoveExecutionClassHandler(Handler[RemoveExecutionClass, str]):
    """Removes the person's own class, or resets a built-in one; a built-in class is never removed, only reset."""

    command = RemoveExecutionClass

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RemoveExecutionClass, context: Context) -> str:
        is_builtin = command.name in BUILTIN_NAMES
        if is_builtin and not command.is_reset:
            raise Refusal(f"{command.name} is a built-in class and can not be removed", f"journal queue-class reset {command.name} gives back its default")
        if command.is_reset and not is_builtin:
            raise Refusal(f"{command.name} is no built-in class", f"journal queue-class remove {command.name} removes a class of your own")
        stored = self.queries.query(ExecutionClassRow).filter(name=command.name).first()
        if stored is None:
            return f"{command.name} has its default" if is_builtin else f"there is no class {command.name}"
        self.repository.delete(stored, context)
        return f"{command.name} is back to its default" if is_builtin else f"class {command.name} is removed"
