from core.modules.documents.commands.support.close_text_subcommand import CloseTextSubcommand
from core.modules.documents.models.doc import Doc


class CloseDocSubcommand(CloseTextSubcommand):
    """`journal doc settle`."""

    model = Doc
    cli_name = "doc"
    name = "settle"
