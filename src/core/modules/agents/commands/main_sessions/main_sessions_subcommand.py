from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.agents.support.agent_sessions import AgentSessions


class MainSessionsSubcommand(ReadSubcommand[tuple[str, ...]]):
    """`journal agent main-sessions <program> --environment <name>`: the sessions the environment's main agent
    ran under that program, newest first, from its session history."""

    cli_name = "agent"
    name = "main-sessions"
    environment_refusal = "the main sessions are shown for one environment"

    def __init__(self, sessions: AgentSessions) -> None:
        self.sessions = sessions

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("program")

    def read(self, arguments: Namespace, caller: Caller) -> tuple[str, ...]:
        return self.sessions.main_sessions(arguments.program)

    def write_output(self, value: object, output: Output) -> None:
        if is_tuple(value):
            sessions = [session for session in value if isinstance(session, str)]
            output.write("\n".join(sessions), {"rows": [{"session": session} for session in sessions]})
