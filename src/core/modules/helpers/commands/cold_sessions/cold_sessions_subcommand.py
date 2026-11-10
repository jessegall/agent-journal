from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.helpers.support.cold_sessions import ColdSessions
from core.modules.settings.bindings.support.context_share import ContextShare
from core.modules.helpers.commands.cold_sessions.support.cold_session import ColdSession


class ColdSessionsSubcommand(ReadSubcommand[tuple[ColdSession, ...]]):
    """`journal helper cold-sessions <program> --environment <name>`: the program's main sessions in the environment
    whose prompt cache has gone cold and whose context is large, for the boot menu to offer a fresh start."""

    cli_name = "helper"
    name = "cold-sessions"
    environment_refusal = "the cold sessions are shown for one environment"

    def __init__(self, queries: Queries, cold: ColdSessions, share: ContextShare) -> None:
        self.queries, self.cold, self.share = queries, cold, share

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("program")

    def read(self, arguments: Namespace, caller: Caller) -> tuple[ColdSession, ...]:
        return tuple(ColdSession(agent.session, self.share.percent(arguments.program, agent.session))
                     for agent in MainAgentFinder.sessions(self.queries, arguments.program) if self.cold.is_cold(agent))

    def write_output(self, value: object, output: Output) -> None:
        if is_tuple(value):
            rows = [{"session": row.session, "context_percent": row.context_percent} for row in value if isinstance(row, ColdSession)]
            output.write("\n".join(f"{row['session']} {'unknown' if row['context_percent'] is None else str(row['context_percent']) + '%'}" for row in rows) or "no cold sessions", {"rows": rows})
