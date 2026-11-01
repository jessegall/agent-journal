from core.modules.documents.commands.make_text.text_make_subcommand import TextMakeSubcommand
from core.modules.documents.models.report import Report


class ReportMakeSubcommand(TextMakeSubcommand):
    """`journal report make`."""

    model = Report
    cli_name = "report"
