from core.modules.documents.commands.support.text_comment_subcommand import TextCommentSubcommand
from core.modules.documents.models.report import Report


class ReportCommentSubcommand(TextCommentSubcommand):
    """`journal report comment`."""

    model = Report
    cli_name = "report"
