from core.modules.documents.commands.support.text_list_subcommand import TextListSubcommand
from core.modules.documents.models.doc import Doc


class DocListSubcommand(TextListSubcommand):
    """`journal doc list`."""

    model = Doc
    cli_name = "doc"
