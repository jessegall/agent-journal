from core.modules.documents.commands.support.work_context_subcommand import WorkContextSubcommand
from core.modules.tasks.models.task import Task


class TaskContextSubcommand(WorkContextSubcommand):
    """Reads the shared bounded conversation for one authorized task."""

    model = Task
    cli_name = "task"
