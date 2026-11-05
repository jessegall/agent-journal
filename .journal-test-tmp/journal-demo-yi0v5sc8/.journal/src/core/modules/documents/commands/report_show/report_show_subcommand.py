from core.modules.documents.commands.support.text_show_subcommand import TextShowSubcommand
from core.modules.documents.models.report import Report


class ReportShowSubcommand(TextShowSubcommand):
    """`journal report show`."""

    model = Report
    cli_name = "report"
