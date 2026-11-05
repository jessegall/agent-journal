from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.modules.triggers.commands.schedule_trigger.schedule_trigger import ScheduleTrigger
from core.modules.triggers.commands.support.show_trigger_line_subcommand import ShowTriggerLineSubcommand
from core.modules.triggers.commands.support.trigger_details import TriggerDetails
from core.modules.triggers.models.enums.trigger_action import TriggerAction


class ScheduleTriggerSubcommand(ShowTriggerLineSubcommand[ScheduleTrigger]):
    """`journal trigger schedule "<text>"` with `--at`, `--every <minutes>` or `--cron "<line>"`, and an end
    with `--until` or `--times <n>`."""

    cli_name = "trigger"
    name = "schedule"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("text")
        parser.add_argument("--at", default="")
        parser.add_argument("--every", type=int)
        parser.add_argument("--cron", default="")
        parser.add_argument("--until", default="")
        parser.add_argument("--times", type=int)
        parser.add_argument("--do", type=TriggerAction, choices=list(TriggerAction), default=TriggerAction.NUDGE)
        TriggerDetails.add_arguments(parser)

    def command(self, arguments: Namespace, caller: Caller) -> ScheduleTrigger:
        return ScheduleTrigger(arguments.text, arguments.at, arguments.every, arguments.cron, arguments.until, arguments.times, arguments.do, TriggerDetails.parsed(arguments))
