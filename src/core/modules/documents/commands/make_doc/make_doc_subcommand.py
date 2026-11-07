from core.modules.documents.commands.make_text.make_text_subcommand import MakeTextSubcommand
from core.modules.documents.models.doc import Doc


class MakeDocSubcommand(MakeTextSubcommand):
    """`journal doc make`."""

    model = Doc
    cli_name = "doc"
