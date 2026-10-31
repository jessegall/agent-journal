from core.modules.documents.commands.support.text_close_subcommand import TextCloseSubcommand
from core.modules.documents.models.doc import Doc


class DocCloseSubcommand(TextCloseSubcommand):
    """`journal doc settle`."""

    model = Doc
    cli_name = "doc"
