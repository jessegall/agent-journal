from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.agents.commands.launch_agent.launch_agent import LaunchAgent
from core.modules.agents.models.agent import Agent


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
            output.line(f"started agent {value.id}")
