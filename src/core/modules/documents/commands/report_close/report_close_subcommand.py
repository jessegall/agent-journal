from core.modules.documents.commands.support.text_close_subcommand import TextCloseSubcommand
from core.modules.documents.models.report import Report


class ReportCloseSubcommand(TextCloseSubcommand):
    """`journal report settle`."""

    model = Report
    cli_name = "report"
