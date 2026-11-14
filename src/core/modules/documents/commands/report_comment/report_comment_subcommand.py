from core.modules.documents.commands.support.comment_text_subcommand import CommentTextSubcommand
from core.modules.documents.models.report import Report


class ReportCommentSubcommand(CommentTextSubcommand):
    """`journal report comment`."""

    model = Report
    cli_name = "report"
