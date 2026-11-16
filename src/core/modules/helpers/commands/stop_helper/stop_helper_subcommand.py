from engine.cli.agent_id import AgentId
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.helpers.commands.stop_helper.stop_helper import StopHelper


class StopHelperSubcommand(Subcommand[StopHelper, None]):
    """`journal helper stop <n>`."""

    cli_name = "helper"
    name = "stop"
    external = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("helper_id", type=AgentId)

    def command(self, arguments: Namespace, caller: Caller) -> StopHelper:
        return StopHelper(arguments.helper_id)
