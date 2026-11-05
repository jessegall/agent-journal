from core.modules.documents.commands.make_text.make_text_subcommand import MakeTextSubcommand
from core.modules.documents.models.report import Report


class ReportMakeSubcommand(MakeTextSubcommand):
    """`journal report make`."""

    model = Report
    cli_name = "report"
