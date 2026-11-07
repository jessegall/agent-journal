from core.modules.documents.commands.support.text_comments_subcommand import TextCommentsSubcommand
from core.modules.documents.models.doc import Doc


class DocCommentsSubcommand(TextCommentsSubcommand):
    """`journal doc comments`."""

    model = Doc
    cli_name = "doc"
