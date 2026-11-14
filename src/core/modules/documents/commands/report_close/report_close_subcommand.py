from core.modules.documents.commands.support.close_text_subcommand import CloseTextSubcommand
from core.modules.documents.models.report import Report


class ReportCloseSubcommand(CloseTextSubcommand):
    """`journal report settle`."""

    model = Report
    cli_name = "report"
