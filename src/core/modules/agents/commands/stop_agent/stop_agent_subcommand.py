from engine.cli.agent_number import AgentNumber
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.agents.commands.stop_agent.stop_agent import StopAgent
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel


class StopAgentSubcommand(Subcommand[StopAgent, Agent]):
    """`journal agent stop <agent>`: stops a running agent's program and ends its session."""

    cli_name = "agent"
    name = "stop"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=AgentNumber)

    def command(self, arguments: Namespace, caller: Caller) -> StopAgent:
        return StopAgent(arguments.agent_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Agent):
            output.line(f"stopped {AgentLabel.labelled(value).text}")
