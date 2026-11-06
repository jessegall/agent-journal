from argparse import ArgumentParser, Namespace
from collections.abc import Sequence

from core.base.caller.caller import Caller
from core.base.subcommand.row_lines import RowLines
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.triggers.commands.support.trigger_lines import TriggerLines
from core.modules.triggers.models.enums.trigger_action import TriggerAction
from core.modules.triggers.models.trigger import Trigger
from core.modules.triggers.queries.trigger_query import TriggerQuery


class TriggerListSubcommand(ReadSubcommand[Sequence[Trigger]]):
    """`journal trigger list`: the triggers still open, with what sets each off."""

    cli_name = "trigger"
    name = "list"

    def __init__(self, triggers: TriggerQuery) -> None:
        self.triggers = triggers

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--skill", nargs="?", const="*")

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[Trigger]:
        return tuple(trigger for trigger in self.triggers.open() if arguments.skill is None or (trigger.action is TriggerAction.SKILL and (arguments.skill == "*" or trigger.skill == arguments.skill)))

    def write_output(self, value: object, output: Output) -> None:
        RowLines.write(output, value, Trigger, TriggerLines.listed)
