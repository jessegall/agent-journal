from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.modules.triggers.commands.schedule_trigger import ScheduleTrigger
from core.modules.triggers.commands.support.trigger_line_subcommand import TriggerLineSubcommand


class ScheduleTriggerSubcommand(TriggerLineSubcommand[ScheduleTrigger]):
    """`journal trigger schedule "<text>"` with `--at`, `--every <minutes>` or `--cron "<line>"`, and an end with
    `--until` or `--times <n>`."""

    cli_name = "trigger"
    name = "schedule"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("text")
        parser.add_argument("--at", default="")
        parser.add_argument("--every", type=int)
        parser.add_argument("--cron", default="")
        parser.add_argument("--until", default="")
        parser.add_argument("--times", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> ScheduleTrigger:
        return ScheduleTrigger(arguments.text, arguments.at, arguments.every, arguments.cron, arguments.until, arguments.times)
