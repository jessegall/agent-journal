from core.modules.documents.commands.support.text_comments_subcommand import TextCommentsSubcommand
from core.modules.documents.models.report import Report


class ReportCommentsSubcommand(TextCommentsSubcommand):
    """`journal report comments`."""

    model = Report
    cli_name = "report"
