from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plan_reviews.support.plan_rounds import PlanRounds
from core.modules.plan_reviews.support.review_tip import ReviewTip
from core.modules.plans.models.plan import Plan


class PlanReviewTipSubcommand(ReadSubcommand[ReviewTip]):
    """`journal plan review-tip <n>`: how many reviewers read the plan in its latest review round, which have
    reported and which are still reading; the tooltip of the 'under review' badge."""

    cli_name = "plan"
    name = "review-tip"

    def __init__(self, queries: Queries, rounds: PlanRounds) -> None:
        self.queries, self.rounds = queries, rounds

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plan_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> ReviewTip:
        rounds = self.rounds.rounds(self.queries.query(Plan).find(arguments.plan_id))
        return ReviewTip(rounds[-1] if rounds else None)

    def write_output(self, value: object, output: Output) -> None:
        lines = value.lines() if isinstance(value, ReviewTip) else ()
        output.write("\n".join(lines), {"lines": list(lines)})
