from core.modules.documents.commands.support.comment_text_subcommand import CommentTextSubcommand
from core.modules.messages.models.message import Message


class CommentMessageSubcommand(CommentTextSubcommand):
    """`journal message comment`."""

    model = Message
    cli_name = "message"
