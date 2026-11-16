from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_number import AgentNumber
from engine.subcommand.subcommand import Subcommand
from core.modules.helpers.commands.retry_hand_in.retry_hand_in import RetryHandIn


class RetryHandInSubcommand(Subcommand[RetryHandIn, str]):
    """`journal hand-in retry <n>`: saves a helper's kept report again."""

    cli_name = "hand-in"
    name = "retry"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("helper_id", type=AgentNumber)

    def command(self, arguments: Namespace, caller: Caller) -> RetryHandIn:
        return RetryHandIn(arguments.helper_id)
