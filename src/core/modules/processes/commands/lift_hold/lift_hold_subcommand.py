from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.processes.commands.lift_hold.lift_hold import LiftHold


class LiftHoldSubcommand(Subcommand[LiftHold, int]):
    """`journal process lift-hold <agent>`: what the agent card's Lift this hold button sends; only a person may."""

    cli_name = "process"
    name = "lift-hold"

    def __init__(self, numbers: RowNumbers) -> None:
        self.numbers = numbers

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent", type=int, help="the number of the agent")

    def command(self, arguments: Namespace, caller: Caller) -> LiftHold:
        return LiftHold(self.numbers.row_id(AGENT_MODEL_NAME, arguments.agent, caller.environment_id))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, int):
            output.line(f"{value} holds lifted")
