from core.modules.documents.commands.support.text_make_subcommand import TextMakeSubcommand
from core.modules.documents.models.doc import Doc


class DocMakeSubcommand(TextMakeSubcommand):
    """`journal doc make`."""

    model = Doc
    cli_name = "doc"
