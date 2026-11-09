from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder


class MainSessionsSubcommand(ReadSubcommand[tuple[Agent, ...]]):
    """`journal agent main-sessions <program> --environment <name>`: the program's main agent sessions in the
    environment, newest first."""

    cli_name = "agent"
    name = "main-sessions"
    environment_refusal = "the main sessions are shown for one environment"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("program")

    def read(self, arguments: Namespace, caller: Caller) -> tuple[Agent, ...]:
        return MainAgentFinder.sessions(self.queries, arguments.program)

    def write_output(self, value: object, output: Output) -> None:
        if is_tuple(value):
            sessions = [agent.session for agent in value if isinstance(agent, Agent)]
            output.write("\n".join(sessions), {"rows": [{"session": session} for session in sessions]})
