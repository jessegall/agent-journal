from argparse import ArgumentParser, Namespace
from datetime import timedelta

from core.base.caller.caller import Caller
from core.base.clock import Clock
from core.base.query.conditions.greater import Greater
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.timestamp import Timestamp
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.support.task_board_cards import TaskBoardCards
from core.modules.tasks.support.task_counts import TaskCounts

DEFAULT_HOURS = 24


class TaskCountsSubcommand(ReadSubcommand[TaskCounts]):
    """`journal task counts [--hours <n> | --since <time>]`: the tasks in progress (started or in testing),
    blocked and open as they stand now, delegated ones included, and the tasks completed in the last hours
    (24 by default) or after a time."""

    cli_name = "task"
    name = "counts"
    environment_refusal = "the counts are shown for one environment"

    def __init__(self, cards: TaskBoardCards, clock: Clock) -> None:
        self.cards, self.clock = cards, clock

    def arguments(self, parser: ArgumentParser) -> None:
        range_group = parser.add_mutually_exclusive_group()
        range_group.add_argument("--hours", type=float, default=DEFAULT_HOURS, help="count the tasks completed in the last hours")
        range_group.add_argument("--since", default=None, help="count the tasks completed after this time")

    def read(self, arguments: Namespace, caller: Caller) -> TaskCounts:
        since = Timestamp.parsed(arguments.since) if arguments.since else Timestamp(self.clock.timestamp().value - timedelta(hours=arguments.hours))
        completed = self.cards.cards(TaskState.COMPLETED, []).matching(Greater("closed_at", since.text)).count()
        return TaskCounts(self.cards.matching_states(TaskState.STARTED, TaskState.TESTING).count(), self.cards.matching_states(TaskState.BLOCKED).count(), self.cards.matching_states(TaskState.OPEN).count(), completed, since.text)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, TaskCounts):
            output.write(f"in progress: {value.started}\nblocked: {value.blocked}\nopen: {value.open}\ncompleted: {value.completed} since {value.since}",
                         {"in_progress": value.started, "blocked": value.blocked, "open": value.open, "completed": value.completed, "since": value.since})
