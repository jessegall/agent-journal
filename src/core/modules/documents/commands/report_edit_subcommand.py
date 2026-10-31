from core.base.subcommand.output import Output
from core.modules.documents.commands.support.text_edit_subcommand import TextEditSubcommand
from core.modules.documents.models.report import Report


class ReportEditSubcommand(TextEditSubcommand):
    """`journal report edit`."""

    model = Report
    cli_name = "report"

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Report):
            output.line(f"report {value.id} written anew: {value.abstract}")
