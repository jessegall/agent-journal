from engine.query.conditions.less import Less
from engine.query.condition import Condition
from core.modules.tasks.conditions.closed_task_cursor import ClosedTaskCursor
from core.modules.tasks.conditions.planless_task import PlanlessTask
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.model.state_book import StateBook
from engine.query.query import PAGE_SIZE_ROWS, Query
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_card import TaskCard
from core.modules.tasks.support.task_board import TaskBoard
from core.modules.tasks.support.task_group import TaskGroup
from core.modules.tasks.support.task_board_cards import FINISHED_STATES, TaskBoardCards

FINISHED_PAGE_ROWS = 10
WORKING_STATES = (TaskState.STARTED, TaskState.TESTING, TaskState.BLOCKED)


def board_group(text: str) -> TaskState | str:
    return TaskState(text) if text in TaskState._value2member_map_ else text

WORKING_TASKS_REASON = "The board shows every task that is being worked on; the columns of open and closed tasks are read a page at a time."


class TaskBoardSubcommand(ReadSubcommand[TaskBoard]):
    """Reads task board groups with state counts. The tasks in progress, in testing and blocked come whole on
    the first read, so a page holds only open and finished tasks past them. A group named in hide-plan-tasks
    leaves out the tasks of a plan, in its rows and its count."""

    cli_name = "task"
    name = "board"
    environment_refusal = "the board is shown for one environment"

    def __init__(self, cards: TaskBoardCards, book: StateBook) -> None:
        self.cards, self.book = cards, book

    def added_states(self) -> tuple[str, ...]:
        lifecycle = self.book.lifecycle(Task)
        return lifecycle.added_states if lifecycle is not None else ()

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--state", type=board_group)
        parser.add_argument("--before-id", type=int, default=None, help="the rows older than this one")
        parser.add_argument("--before-closed-at", default=None, help="the finished rows closed before this time")
        parser.add_argument("--limit", type=int, default=None)
        parser.add_argument("--tag", action="append", default=[], help="show tasks with every named tag")
        parser.add_argument("--hide-plan-tasks", default="", help="the groups, with commas, that leave out the tasks of a plan")

    def read(self, arguments: Namespace, caller: Caller) -> TaskBoard:
        if arguments.state is not None:
            if arguments.state in FINISHED_STATES:
                return TaskBoard(tuple([self.finished_group(arguments.state, arguments)]))
            return TaskBoard(tuple([self.group(arguments.state, arguments)]))
        active_groups = tuple(self.group(state, arguments) for state in (TaskState.STARTED, TaskState.TESTING, TaskState.BLOCKED, TaskState.OPEN, *self.added_states()))
        finished = tuple(self.finished_group(state, arguments) for state in FINISHED_STATES)
        return TaskBoard((*active_groups, *finished))

    def shown_cards(self, state: TaskState | str, arguments: Namespace) -> Query[TaskCard]:
        cards = self.cards.cards(state, arguments.tag)
        return cards.matching(PlanlessTask()) if str(state) in arguments.hide_plan_tasks.split(",") else cards

    def group(self, state: TaskState | str, arguments: Namespace) -> TaskGroup:
        cards = self.shown_cards(state, arguments)
        previous_id = arguments.before_id if arguments.state is not None else None
        limit = arguments.limit or PAGE_SIZE_ROWS
        rows = (cards.matching(Less("id", previous_id)) if previous_id is not None else cards).newest()
        return TaskGroup(str(state), cards.count(), tuple(rows.full_table(WORKING_TASKS_REASON).all_rows() if state in WORKING_STATES else rows.limited(limit)))

    @staticmethod
    def finished_cursor(arguments: Namespace) -> Condition | None:
        if arguments.before_closed_at is None:
            return None
        if arguments.before_id is None:
            return Less("closed_at", arguments.before_closed_at)
        return ClosedTaskCursor(arguments.before_closed_at, arguments.before_id)

    def finished_group(self, state: TaskState, arguments: Namespace) -> TaskGroup:
        cards = self.shown_cards(state, arguments)
        cursor = self.finished_cursor(arguments) if arguments.state is not None else None
        rows = cards.matching(cursor) if cursor is not None else cards
        return TaskGroup(state.value, cards.count(), tuple(rows.descending("closed_at", "id").limited(arguments.limit or FINISHED_PAGE_ROWS)))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, TaskBoard):
            output.write("\n".join(f"{group.state}: {group.total}" for group in value.groups), value.json())
