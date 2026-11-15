from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.restore_stacked_state.restore_stacked_state import RestoreStackedState


class RestoreStackedStateSubcommand(Subcommand[RestoreStackedState, str]):
    """`journal driver restore <agent> <stacked state>`: a person shows the work they removed from an agent's stack
    again."""

    cli_name = "driver"
    name = "restore"
    external = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent", type=int)
        parser.add_argument("frame")

    def command(self, arguments: Namespace, caller: Caller) -> RestoreStackedState:
        return RestoreStackedState(arguments.agent, arguments.stacked_state)
