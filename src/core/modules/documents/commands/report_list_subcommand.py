from core.modules.documents.commands.support.text_list_subcommand import TextListSubcommand
from core.modules.documents.models.report import Report


class ReportListSubcommand(TextListSubcommand):
    """`journal report list`."""

    model = Report
    cli_name = "report"
