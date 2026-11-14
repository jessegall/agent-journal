from core.modules.documents.commands.support.comment_text_subcommand import CommentTextSubcommand
from core.modules.plans.models.plan import Plan


class CommentPlanSubcommand(CommentTextSubcommand):
    """`journal plan comment`."""

    model = Plan
    cli_name = "plan"
