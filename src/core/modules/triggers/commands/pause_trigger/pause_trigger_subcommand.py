from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.triggers.commands.pause_trigger.pause_trigger import PauseTrigger
from core.modules.triggers.models.trigger import Trigger


class PauseTriggerSubcommand(Subcommand[PauseTrigger, Trigger]):
    """`journal trigger pause <n> [--off]`: the trigger is paused until it is let go on."""

    cli_name = "trigger"
    name = "pause"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)
        parser.add_argument("--off", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> PauseTrigger:
        return PauseTrigger(arguments.id, not arguments.off)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Trigger):
            output.line(f"trigger {value.id} {'paused' if value.paused_at else 'goes on'}")
