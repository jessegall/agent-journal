from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.triggers.commands.strike_trigger import StrikeTrigger
from core.modules.triggers.models.trigger import Trigger


class StrikeTriggerSubcommand(Subcommand[StrikeTrigger, Trigger]):
    """`journal trigger strike <n>`: the trigger gives its text no more."""

    cli_name = "trigger"
    name = "strike"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> StrikeTrigger:
        return StrikeTrigger(arguments.id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Trigger):
            output.line(f"trigger {value.id} struck")
