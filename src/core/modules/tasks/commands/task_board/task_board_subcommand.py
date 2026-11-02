from core.base.query.conditions.among import Among
from core.base.query.conditions.is_not_null import IsNotNull
from core.base.query.conditions.is_null import IsNull
from core.base.query.conditions.less import Less
from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.query.query import PAGE_SIZE_ROWS, Query
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.tasks.models.enums.task_state import TaskState
from core.base.query.queries import Queries
from core.modules.tasks.models.task_card import TaskCard
from core.modules.tasks.support.task_board import TaskBoard
from core.modules.tasks.support.task_group import TaskGroup

ACTIVE_STATES = (TaskState.STARTED, TaskState.TESTING, TaskState.BLOCKED, TaskState.OPEN)
FINISHED_STATES = (TaskState.COMPLETED, TaskState.CANCELLED)
FINISHED_PAGE_ROWS = 10
DELEGATED = "delegated"


def board_group(text: str) -> TaskState | str:
    return text if text == DELEGATED else TaskState(text)


class TaskBoardSubcommand(ReadSubcommand[TaskBoard]):
    """`journal task board [--environment <name>] [--state <state> --before-id <n> --before-closed-at <time>
    --limit <n>]`: the first page of every state in one answer, or one more page of one state. A finished
    state runs from the task closed last and pages by that time; any other from the newest task, by its
    number. The tasks delegated to a worker that are not finished are the group `delegated`, apart from the
    state groups."""

    cli_name = "task"
    name = "board"

    def __init__(self, queries: Queries, environment_names: EnvironmentNames) -> None:
        self.queries, self.environment_names = queries, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")
        parser.add_argument("--state", type=board_group)
        parser.add_argument("--before-id", type=int, default=None, help="the rows older than this one")
        parser.add_argument("--before-closed-at", default=None, help="the finished rows closed before this time")
        parser.add_argument("--limit", type=int, default=None)

    def read(self, arguments: Namespace, caller: Caller) -> TaskBoard:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("the board is shown for one environment", "name it with --environment")
        if arguments.state is not None:
            if arguments.state in FINISHED_STATES:
                return TaskBoard(tuple([self.finished_group(environment_id, arguments.state, arguments.before_closed_at, arguments.limit or FINISHED_PAGE_ROWS)]))
            return TaskBoard(tuple([self.group(environment_id, arguments.state, arguments.before_id, arguments.limit or PAGE_SIZE_ROWS)]))
        active_groups = tuple(self.group(environment_id, state, None, PAGE_SIZE_ROWS) for state in (TaskState.STARTED, TaskState.TESTING, TaskState.BLOCKED, DELEGATED, TaskState.OPEN))
        finished = tuple(self.finished_group(environment_id, state, None, FINISHED_PAGE_ROWS) for state in FINISHED_STATES)
        return TaskBoard((*active_groups, *finished))

    def group(self, environment_id: int, state: TaskState | str, previous_id: int | None, size: int) -> TaskGroup:
        cards = self.cards(environment_id, state)
        rows = cards.matching(Less("id", previous_id)) if previous_id is not None else cards
        return TaskGroup(str(state), cards.count(), tuple(rows.newest().page(1, size).rows))

    def finished_group(self, environment_id: int, state: TaskState, closed_limit: str | None, size: int) -> TaskGroup:
        cards = self.cards(environment_id, state)
        rows = cards.matching(Less("closed_at", closed_limit)) if closed_limit is not None else cards
        return TaskGroup(state.value, cards.count(), tuple(rows.descending("closed_at").page(1, size).rows))

    def cards(self, environment_id: int, state: TaskState | str) -> Query[TaskCard]:
        cards = self.queries.query(TaskCard).filter(environment_id=environment_id)
        if state == DELEGATED:
            return cards.matching(IsNotNull("delegated_to")).matching(Among("state", [active.value for active in ACTIVE_STATES]))
        cards = cards.filter(state=state)
        return cards if state in FINISHED_STATES else cards.matching(IsNull("delegated_to"))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, TaskBoard):
            output.write("\n".join(f"{group.state}: {group.total}" for group in value.groups), value.json())
