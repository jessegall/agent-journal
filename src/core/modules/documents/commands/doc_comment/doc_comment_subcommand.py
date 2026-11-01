from core.modules.documents.commands.support.text_comment_subcommand import TextCommentSubcommand
from core.modules.documents.models.doc import Doc


class DocCommentSubcommand(TextCommentSubcommand):
    """`journal doc comment`."""

    model = Doc
    cli_name = "doc"
