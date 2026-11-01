from core.base.subcommand.output import Output
from core.modules.documents.commands.support.text_edit_subcommand import TextEditSubcommand
from core.modules.documents.models.doc import Doc


class DocEditSubcommand(TextEditSubcommand):
    """`journal doc edit`."""

    model = Doc
    cli_name = "doc"

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Doc):
            output.line(f"doc {value.id} written anew: {value.title}")
