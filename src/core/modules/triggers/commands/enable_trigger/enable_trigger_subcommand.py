from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.triggers.commands.enable_trigger.enable_trigger import EnableTrigger
from core.modules.triggers.models.trigger import Trigger


class EnableTriggerSubcommand(Subcommand[EnableTrigger, Trigger]):
    """`journal trigger enable <n>`: a trigger an agent made starts to act."""

    cli_name = "trigger"
    name = "enable"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> EnableTrigger:
        return EnableTrigger(arguments.id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Trigger):
            output.line(f"trigger {value.id} is enabled")
