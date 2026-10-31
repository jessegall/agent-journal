from argparse import ArgumentParser, Namespace

from core.modules.agents.models.agent import Agent
from core.base.agent_role import AgentRole
from core.modules.agents.commands.start_agent import StartAgent
from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.base.timestamp import Timestamp


class StartAgentSubcommand(Subcommand[StartAgent, Agent]):
    """`journal agent start <session> <program> <role> [--parent <id>] [--pid <pid> --process-started-at <time>]`,
    run when a session of an agent program begins; agents have no make subcommand."""

    cli_name = "agent"
    name = "start"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("session")
        parser.add_argument("program")
        parser.add_argument("role", type=AgentRole, choices=tuple(AgentRole))
        parser.add_argument("--parent", type=int)
        parser.add_argument("--pid", type=int)
        parser.add_argument("--process-started-at", type=Timestamp.parsed)

    def command(self, arguments: Namespace, caller: Caller) -> StartAgent:
        return StartAgent(arguments.session, arguments.program, arguments.role, arguments.parent, arguments.pid, arguments.process_started_at)
