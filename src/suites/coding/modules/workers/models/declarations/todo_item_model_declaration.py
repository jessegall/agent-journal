from engine.module.model_declaration import ModelDeclaration
from suites.coding.modules.workers.models.todo_item import TodoItem


class TodoItemModelDeclaration(ModelDeclaration):
    """How the module declares TodoItem."""

    model = TodoItem
    excluded_subcommands = ["make", "edit", "delete"]
