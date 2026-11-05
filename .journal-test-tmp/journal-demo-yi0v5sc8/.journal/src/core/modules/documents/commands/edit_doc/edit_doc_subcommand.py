from core.base.subcommand.output import Output
from core.modules.documents.commands.support.edit_text_subcommand import EditTextSubcommand
from core.modules.documents.models.doc import Doc


class EditDocSubcommand(EditTextSubcommand):
    """`journal doc edit`."""

    model = Doc
    cli_name = "doc"

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Doc):
            output.line(f"doc {value.id} written anew: {value.title}")
