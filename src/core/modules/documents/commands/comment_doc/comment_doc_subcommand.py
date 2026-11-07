from core.modules.documents.commands.support.comment_text_subcommand import CommentTextSubcommand
from core.modules.documents.models.doc import Doc


class CommentDocSubcommand(CommentTextSubcommand):
    """`journal doc comment`."""

    model = Doc
    cli_name = "doc"
