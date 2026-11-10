from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.agents.commands.record_agent_interrupt.record_agent_interrupt import RecordAgentInterrupt
from core.modules.agents.models.agent import Agent


class RecordAgentInterruptSubcommand(Subcommand[RecordAgentInterrupt, Agent]):
    """`journal agent interrupted <agent>`: the launcher tells that it saw the agent's turn interrupted, or the login
    command entered in its terminal."""

    cli_name = "agent"
    name = "interrupted"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> RecordAgentInterrupt:
        return RecordAgentInterrupt(arguments.agent_id)
