from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.pause_agent.pause_agent import PauseAgent


class PauseAgentSubcommand(Subcommand[PauseAgent, Agent]):
    """`journal agent pause <agent>`: holds a running agent until a person resumes it."""

    cli_name = "agent"
    name = "pause"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> PauseAgent:
        return PauseAgent(arguments.agent_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Agent):
            output.line(f"paused agent {value.id}")
