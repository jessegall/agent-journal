from core.modules.documents.commands.support.text_comments_subcommand import TextCommentsSubcommand
from core.modules.plans.models.plan import Plan


class PlanCommentsSubcommand(TextCommentsSubcommand):
    """`journal plan comments`."""

    model = Plan
    cli_name = "plan"
