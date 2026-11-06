from argparse import ArgumentParser, Namespace

from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.refusal import Refusal
from core.modules.tasks.commands.make_task_log.make_task_log import MakeTaskLog

NO_DIFFERENCES = "none"
QUESTION = 'what did you do differently from the task, or leave out? Say so with --differences "<what>", or --differences none'


def add_differences_argument(parser: ArgumentParser) -> None:
    parser.add_argument("--differences", default="", help="what differs from the task or was left out, or none")


def required_differences(arguments: Namespace) -> str:
    if not arguments.differences.strip():
        raise Refusal(QUESTION)
    return arguments.differences.strip()


class HandInDifferences:
    """What a worker says at a hand-in about how its work differs from the task: anything but none is a log line the
    main agent must read."""

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def record(self, task_id: int, differences: str, context: Context) -> None:
        if differences.lower() != NO_DIFFERENCES:
            self.bus.dispatch(MakeTaskLog(task_id, differences, important=True), context)
