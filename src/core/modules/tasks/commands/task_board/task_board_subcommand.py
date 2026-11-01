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
COUNT_PAGE_ROWS = 1


class TaskBoardSubcommand(ReadSubcommand[TaskBoard]):
    """`journal task board [--environment <name>] [--state <state> --before-id <n> --limit <n>]`: the first page of
    each active_groups state and the count of each finished one in one answer, or one more page
    of one state."""

    cli_name = "task"
    name = "board"

    def __init__(self, queries: Queries, environment_names: EnvironmentNames) -> None:
        self.queries, self.environment_names = queries, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")
        parser.add_argument("--state", type=TaskState)
        parser.add_argument("--before-id", type=int, default=None, help="the rows older than this one")
        parser.add_argument("--limit", type=int, default=PAGE_SIZE_ROWS)

    def read(self, arguments: Namespace, caller: Caller) -> TaskBoard:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("the board is shown for one environment", "name it with --environment")
        if arguments.state is not None:
            return TaskBoard(tuple([self.group(environment_id, arguments.state, arguments.before_id, arguments.limit)]))
        active_groups = tuple(self.group(environment_id, state, None, PAGE_SIZE_ROWS) for state in ACTIVE_STATES)
        finished = tuple(TaskGroup(state.value, self.cards(environment_id, state).page(1, COUNT_PAGE_ROWS).total, ()) for state in FINISHED_STATES)
        return TaskBoard((*active_groups, *finished))

    def group(self, environment_id: int, state: TaskState, previous_id: int | None, size: int) -> TaskGroup:
        cards = self.cards(environment_id, state)
        rows = cards.matching(Less("id", previous_id)) if previous_id is not None else cards
        return TaskGroup(state.value, cards.count(), tuple(rows.newest().page(1, size).rows))

    def cards(self, environment_id: int, state: TaskState) -> Query[TaskCard]:
        return self.queries.query(TaskCard).filter(environment_id=environment_id, state=state)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, TaskBoard):
            output.write("\n".join(f"{group.state}: {group.total}" for group in value.groups), value.json())
