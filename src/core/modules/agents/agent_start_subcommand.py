from argparse import ArgumentParser, Namespace

from core.modules.agents.agent import Agent, AgentRole
from core.modules.agents.agent_start import AgentStart
from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand


class AgentStartSubcommand(Subcommand[AgentStart, Agent]):
    """`journal agent start <session> <program> <role> [--parent <id>]`, run when a session of an agent program
    begins; agents have no make subcommand."""

    cli_name = "agent"
    name = "start"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("session")
        parser.add_argument("program")
        parser.add_argument("role", type=AgentRole, choices=tuple(AgentRole))
        parser.add_argument("--parent", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> AgentStart:
        return AgentStart(arguments.session, arguments.program, arguments.role, arguments.parent)
