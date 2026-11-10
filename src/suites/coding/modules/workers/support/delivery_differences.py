from argparse import ArgumentParser, Namespace

from engine.command.bus import Bus
from engine.command.context import Context
from engine.errors.refusal import Refusal
from core.modules.tasks.commands.make_task_log.make_task_log import MakeTaskLog

NONE_ANSWER = "none"
QUESTION = 'did you do anything other than the task brief asked, or leave part of it out? Say only that with --differences "<what>", never what you did; if you followed the brief, --differences none'


def differences_flag(parser: ArgumentParser) -> None:
    parser.add_argument("--differences", default="", help="only what differs from the task brief or was left out, never a report of the work; none when you followed the brief")


def required_differences(arguments: Namespace) -> str:
    if not arguments.differences.strip():
        raise Refusal(QUESTION)
    return arguments.differences.strip()


def is_none_answer(differences: str) -> bool:
    return differences.lower() == NONE_ANSWER


class DeliveryDifferences:
    """What a worker says at a hand-in about how its work differs from the task: anything but none is a log line the
    main agent must read."""

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def record(self, task_id: int, differences: str, context: Context) -> None:
        if not is_none_answer(differences):
            self.bus.dispatch(MakeTaskLog(task_id, differences, important=True), context)
