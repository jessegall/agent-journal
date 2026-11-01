from core.modules.documents.commands.support.text_show_subcommand import TextShowSubcommand
from core.modules.documents.models.doc import Doc


class DocShowSubcommand(TextShowSubcommand):
    """`journal doc show`."""

    model = Doc
    cli_name = "doc"
