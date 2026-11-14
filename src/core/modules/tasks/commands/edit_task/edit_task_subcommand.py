from engine.cli.edit_subcommand import EditSubcommand
from engine.model.tables import Tables
from core.modules.tasks.models.task import Task


class EditTaskSubcommand(EditSubcommand):
    """Edits the fields of a task."""

    cli_name = "task"

    def __init__(self, tables: Tables) -> None:
        super().__init__(tables.table(Task))
