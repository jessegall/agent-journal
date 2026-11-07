from core.base.query.conditions.among import Among
from core.base.query.conditions.has_value import HasValue
from core.base.query.conditions.is_null import IsNull
from core.base.query.conditions.less import Less
from core.base.query.condition import Condition
from core.base.query.conditions.subquery_match import SubqueryMatch
from core.modules.tasks.conditions.closed_task_cursor import ClosedTaskCursor
from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.model.state_book import StateBook
from core.base.query.query import PAGE_SIZE_ROWS, Query
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.tasks.models.enums.task_state import TaskState
from core.base.query.queries import Queries
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_card import TaskCard
from core.modules.tasks.support.task_board import TaskBoard
from core.modules.tasks.support.task_group import TaskGroup
from core.modules.tasks.queries.task_query import TaskQuery

ACTIVE_STATES = (TaskState.STARTED, TaskState.TESTING, TaskState.BLOCKED, TaskState.OPEN)
FINISHED_STATES = (TaskState.COMPLETED, TaskState.CANCELLED)
FINISHED_PAGE_ROWS = 10
DELEGATED = "delegated"


def board_group(text: str) -> TaskState | str:
    return TaskState(text) if text in TaskState._value2member_map_ else text


class TaskBoardSubcommand(ReadSubcommand[TaskBoard]):
    """Reads task board groups with state counts and delegated tasks."""

    cli_name = "task"
    name = "board"
    environment_refusal = "the board is shown for one environment"

    def __init__(self, queries: Queries, book: StateBook, tasks: TaskQuery) -> None:
        self.queries, self.book, self.tasks = queries, book, tasks

    def added_states(self) -> tuple[str, ...]:
        lifecycle = self.book.lifecycle(Task)
        return lifecycle.added_states if lifecycle is not None else ()

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--state", type=board_group)
        parser.add_argument("--before-id", type=int, default=None, help="the rows older than this one")
        parser.add_argument("--before-closed-at", default=None, help="the finished rows closed before this time")
        parser.add_argument("--limit", type=int, default=None)
        parser.add_argument("--tag", action="append", default=[], help="show tasks with every named tag")

    def read(self, arguments: Namespace, caller: Caller) -> TaskBoard:
        if arguments.state is not None:
            if arguments.state in FINISHED_STATES:
                return TaskBoard(tuple([self.finished_group(arguments.state, arguments)]))
            return TaskBoard(tuple([self.group(arguments.state, arguments)]))
        active_groups = tuple(self.group(state, arguments) for state in (TaskState.STARTED, TaskState.TESTING, TaskState.BLOCKED, DELEGATED, TaskState.OPEN, *self.added_states()))
        finished = tuple(self.finished_group(state, arguments) for state in FINISHED_STATES)
        return TaskBoard((*active_groups, *finished))

    def group(self, state: TaskState | str, arguments: Namespace) -> TaskGroup:
        cards = self.cards(state, arguments.tag)
        previous_id = arguments.before_id if arguments.state is not None else None
        rows = cards.matching(Less("id", previous_id)) if previous_id is not None else cards
        return TaskGroup(str(state), cards.count(), tuple(rows.newest().limited(arguments.limit or PAGE_SIZE_ROWS)))

    @staticmethod
    def finished_cursor(arguments: Namespace) -> Condition | None:
        if arguments.before_closed_at is None:
            return None
        if arguments.before_id is None:
            return Less("closed_at", arguments.before_closed_at)
        return ClosedTaskCursor(arguments.before_closed_at, arguments.before_id)

    def finished_group(self, state: TaskState, arguments: Namespace) -> TaskGroup:
        cards = self.cards(state, arguments.tag)
        cursor = self.finished_cursor(arguments) if arguments.state is not None else None
        rows = cards.matching(cursor) if cursor is not None else cards
        return TaskGroup(state.value, cards.count(), tuple(rows.descending("closed_at", "id").limited(arguments.limit or FINISHED_PAGE_ROWS)))

    def cards(self, state: TaskState | str, tags: list[str]) -> Query[TaskCard]:
        cards = self.queries.query(TaskCard)
        for word in tags:
            tasks = self.tasks.tagged(word)
            cards = cards.matching(SubqueryMatch("id", tasks.select.column("id")))
        if state == DELEGATED:
            return cards.matching(HasValue("delegated_to")).matching(Among("state", [active.value for active in ACTIVE_STATES]))
        cards = cards.filter(state=state)
        return cards if state in FINISHED_STATES else cards.matching(IsNull("delegated_to"))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, TaskBoard):
            output.write("\n".join(f"{group.state}: {group.total}" for group in value.groups), value.json())
