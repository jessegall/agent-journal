from core.base.query.conditions.less import Less
from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.model.state_book import StateBook
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.query.query import PAGE_SIZE_ROWS
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_card import PlanCard
from core.modules.plans.support.plan_board import PlanBoard

CLOSED_STATES = (PlanState.COMPLETED, PlanState.CANCELLED)
OPEN_STATES = tuple(state for state in PlanState if state not in CLOSED_STATES)


class PlanBoardSubcommand(ReadSubcommand[PlanBoard]):
    """`journal plan board [--environment <name>] [--closed | --started] [--before-id <id>]`: a page of
    plan cards with their progress, open ones unless closed or started ones are asked for, and how many
    there are of each. Started plans come in the order of their last change, newest first."""

    cli_name = "plan"
    name = "board"
    environment_refusal = "the board is shown for one environment"

    def __init__(self, queries: Queries, book: StateBook) -> None:
        self.queries, self.book = queries, book

    def open_states(self) -> tuple[str, ...]:
        lifecycle = self.book.lifecycle(Plan)
        added = lifecycle.added_states if lifecycle is not None else ()
        return (*OPEN_STATES, *added)

    def arguments(self, parser: ArgumentParser) -> None:
        sides = parser.add_mutually_exclusive_group()
        sides.add_argument("--closed", action="store_true")
        sides.add_argument("--started", action="store_true")
        parser.add_argument("--before-id", type=int, default=None, help="the plans older than this one")
        parser.add_argument("--limit", type=int, default=PAGE_SIZE_ROWS)

    def read(self, arguments: Namespace, caller: Caller) -> PlanBoard:
        plans = self.queries.query(PlanCard)
        opened, closed = plans.matching(Among("state", self.open_states())), plans.matching(Among("state", CLOSED_STATES))
        started = plans.matching(Among("state", (PlanState.STARTED,)))
        if arguments.started:
            return PlanBoard(opened.count(), started.count(), closed.count(), tuple(started.descending("changed_at", "id").limited(arguments.limit)))
        shown = closed if arguments.closed else opened
        older = shown.matching(Less("id", arguments.before_id)) if arguments.before_id is not None else shown
        return PlanBoard(opened.count(), started.count(), closed.count(), tuple(older.newest().limited(arguments.limit)))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PlanBoard):
            output.write(f"{value.open_total} open, {value.started_total} started, {value.closed_total} closed", value.json())
