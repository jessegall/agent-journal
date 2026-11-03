from core.modules.documents.commands.support.text_inspect_subcommand import TextInspectSubcommand
from core.modules.documents.models.report import Report


class ReportInspectSubcommand(TextInspectSubcommand):
    """`journal report inspect`."""

    model = Report
    cli_name = "report"
