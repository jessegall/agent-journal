from core.modules.documents.commands.support.comment_text_subcommand import CommentTextSubcommand
from core.modules.tasks.models.task import Task


class CommentTaskSubcommand(CommentTextSubcommand):
    """`journal task comment`."""

    model = Task
    cli_name = "task"
