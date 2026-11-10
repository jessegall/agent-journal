from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.agents.commands.launch_agent.launch_agent import LaunchAgent
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel


class LaunchAgentSubcommand(Subcommand[LaunchAgent, Agent]):
    """`journal agent launch <program>`: starts an agent program in the environment, through the running
    launcher."""

    cli_name = "agent"
    name = "launch"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("program")

    def command(self, arguments: Namespace, caller: Caller) -> LaunchAgent:
        return LaunchAgent(arguments.program)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Agent):
            output.line(f"started {AgentLabel.from_agent(value).text}")
