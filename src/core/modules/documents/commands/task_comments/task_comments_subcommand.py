from core.modules.documents.commands.support.text_comments_subcommand import TextCommentsSubcommand
from core.modules.tasks.models.task import Task


class TaskCommentsSubcommand(TextCommentsSubcommand):
    """`journal task comments`."""

    model = Task
    cli_name = "task"
