from engine.cli.agent_number import AgentNumber
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.agents.commands.retire_agent.retire_agent import RetireAgent
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel


class RetireAgentSubcommand(Subcommand[RetireAgent, Agent]):
    """`journal agent retire <agent> --reason "<why>"`: retires an agent for good."""

    cli_name = "agent"
    name = "retire"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=AgentNumber)
        parser.add_argument("--reason", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> RetireAgent:
        return RetireAgent(arguments.agent_id, arguments.reason)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Agent):
            output.line(f"retired {AgentLabel.labelled(value).text}")
