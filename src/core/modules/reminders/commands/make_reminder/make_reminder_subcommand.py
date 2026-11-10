from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from engine.time.timestamp import MINUTE_SECONDS, Timestamp
from core.modules.reminders.commands.make_reminder.make_reminder import MakeReminder
from core.modules.reminders.models.reminder import Reminder


class MakeReminderSubcommand(Subcommand[MakeReminder, Reminder]):
    """`journal reminder make "<text>" [--at <time>] [--every-minutes <n>] [--every-tool-uses <n>]
    [--every-tasks <n>] [--once] [--block <condition>] [--block-subject <value>]`."""

    cli_name = "reminder"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("text")
        parser.add_argument("--at", type=Timestamp.parsed)
        parser.add_argument("--every-minutes", type=int, default=0)
        parser.add_argument("--every-tool-uses", type=int, default=0)
        parser.add_argument("--every-tasks", type=int, default=0)
        parser.add_argument("--once", action="store_true")
        parser.add_argument("--block", default="")
        parser.add_argument("--block-subject", default="")

    def command(self, arguments: Namespace, caller: Caller) -> MakeReminder:
        return MakeReminder(arguments.text, arguments.every_minutes * MINUTE_SECONDS, arguments.every_tool_uses, arguments.every_tasks, arguments.at, arguments.once, arguments.block, arguments.block_subject)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Reminder):
            output.line(f"reminder {value.id} made")
