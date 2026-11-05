from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.resume_agent.resume_agent import ResumeAgent


class ResumeAgentSubcommand(Subcommand[ResumeAgent, Agent]):
    """`journal agent resume <agent>`: lets a paused agent carry on."""

    cli_name = "agent"
    name = "resume"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> ResumeAgent:
        return ResumeAgent(arguments.agent_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Agent):
            output.line(f"resumed agent {value.id}")
