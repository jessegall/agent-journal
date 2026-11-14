from core.modules.documents.commands.support.text_inspect_subcommand import TextInspectSubcommand
from core.modules.documents.models.doc import Doc


class DocInspectSubcommand(TextInspectSubcommand):
    """`journal doc inspect`."""

    model = Doc
    cli_name = "doc"
