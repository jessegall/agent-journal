from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.agents.agent import Agent
from core.modules.agents.end_agent import EndAgent


class EndAgentSubcommand(Subcommand[EndAgent, Agent]):
    """`journal agent end <id>`, run when a session of an agent program ends."""

    cli_name = "agent"
    name = "end"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("row_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> EndAgent:
        return EndAgent(arguments.row_id)
