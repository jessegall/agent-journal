from core.base.cli.edit_subcommand import EditSubcommand
from core.base.model.tables import Tables
from core.modules.tasks.models.task import Task


class EditTaskSubcommand(EditSubcommand):
    """Edits the fields of a task."""

    cli_name = "task"
    outward = True

    def __init__(self, tables: Tables) -> None:
        super().__init__(tables.table(Task))
