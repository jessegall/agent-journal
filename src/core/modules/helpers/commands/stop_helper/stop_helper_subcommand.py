from engine.cli.agent_number import AgentNumber
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.helpers.commands.stop_helper.stop_helper import StopHelper


class StopHelperSubcommand(Subcommand[StopHelper, None]):
    """`journal helper stop <n>`."""

    cli_name = "helper"
    name = "stop"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("helper_id", type=AgentNumber)

    def command(self, arguments: Namespace, caller: Caller) -> StopHelper:
        return StopHelper(arguments.helper_id)
