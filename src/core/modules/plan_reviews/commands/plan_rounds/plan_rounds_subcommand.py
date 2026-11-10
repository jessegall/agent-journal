from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from engine.types.type_guards import is_tuple
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plan_reviews.support.plan_round import PlanRound
from core.modules.plan_reviews.support.plan_rounds import PlanRounds
from core.modules.plans.models.plan import Plan


class PlanRoundsSubcommand(ReadSubcommand[tuple[PlanRound, ...]]):
    """`journal plan rounds <n>`: the review rounds of a plan, oldest first, with when each ran, who read it and
    the reports filed."""

    cli_name = "plan"
    name = "rounds"

    def __init__(self, queries: Queries, rounds: PlanRounds) -> None:
        self.queries, self.rounds = queries, rounds

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plan_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> tuple[PlanRound, ...]:
        return self.rounds.rounds(self.queries.query(Plan).find(arguments.plan_id))

    def write_output(self, value: object, output: Output) -> None:
        rounds = tuple(review_round for review_round in value if isinstance(review_round, PlanRound)) if is_tuple(value) else ()
        output.write("\n".join(review_round.line() for review_round in rounds) or "no review rounds", {"rows": [review_round.json() for review_round in rounds]})
