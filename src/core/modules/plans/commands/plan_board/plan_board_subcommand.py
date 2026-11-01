from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.query.query import PAGE_SIZE_ROWS
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_progress import PlanProgress
from core.modules.plans.support.plan_board import PlanBoard, PlanCard

CLOSED_STATES = (PlanState.COMPLETED, PlanState.CANCELLED)
OPEN_STATES = tuple(state for state in PlanState if state not in CLOSED_STATES)
COUNT_PAGE_ROWS = 1


class PlanBoardSubcommand(ReadSubcommand[PlanBoard]):
    """`journal plan board [--environment <name>] [--closed] [--page <n>]`: a page of plan cards with their progress, open ones unless closed ones are asked for, and how many there are of each."""

    cli_name = "plan"
    name = "board"

    def __init__(self, queries: Queries, environment_names: EnvironmentNames) -> None:
        self.queries, self.environment_names = queries, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")
        parser.add_argument("--closed", action="store_true")
        parser.add_argument("--page", type=int, default=1)

    def read(self, arguments: Namespace, caller: Caller) -> PlanBoard:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("the board is shown for one environment", "name it with --environment")
        plans = self.queries.query(Plan).filter(environment_id=environment_id)
        opened, closed = plans.matching(Among("state", OPEN_STATES)), plans.matching(Among("state", CLOSED_STATES))
        rows = (closed if arguments.closed else opened).newest().page(arguments.page, PAGE_SIZE_ROWS).rows
        progress = {row.plan_id: row for row in self.queries.query(PlanProgress).matching(Among("plan_id", tuple(plan.id for plan in rows))).all_rows()}
        cards = tuple(PlanCard(plan.id, plan.title, plan.state.value, progress[plan.id].task_count if plan.id in progress else 0, progress[plan.id].completed_count if plan.id in progress else 0,
                               progress[plan.id].current_phase if plan.id in progress else 0) for plan in rows)
        return PlanBoard(opened.page(1, COUNT_PAGE_ROWS).total, closed.page(1, COUNT_PAGE_ROWS).total, cards)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PlanBoard):
            output.write(f"{value.open_total} open, {value.closed_total} closed", value.json())
