from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_number import AgentNumber
from engine.subcommand.subcommand import Subcommand
from core.modules.helpers.commands.drop_hand_in.drop_hand_in import DropHandIn


class DropHandInSubcommand(Subcommand[DropHandIn, str]):
    """`journal hand-in drop <n>`: ends a helper's job whose report could not be saved."""

    cli_name = "hand-in"
    name = "drop"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("helper_id", type=AgentNumber)

    def command(self, arguments: Namespace, caller: Caller) -> DropHandIn:
        return DropHandIn(arguments.helper_id)
