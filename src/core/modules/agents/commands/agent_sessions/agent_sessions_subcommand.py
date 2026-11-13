from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_number import AgentNumber
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.agents.models.agent_session import AgentSession
from core.modules.agents.support.agent_sessions import AgentSessions

SESSION_LIMIT_ROWS = 50
RUNNING_WORD = "running"
UNSTARTED_TEXT = "not started"
EMPTY_HISTORY_TEXT = "this agent has no session in the history"


class AgentSessionsSubcommand(ReadSubcommand[tuple[AgentSession, ...]]):
    """`journal agent sessions <agent>`: the sessions the agent ran under, newest first, each with its
    program, model, start, end and the reason it ended, or running for its current session, or not
    started for a session that replaced another and whose program has not started."""

    cli_name = "agent"
    name = "sessions"

    def __init__(self, sessions: AgentSessions) -> None:
        self.sessions = sessions

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=AgentNumber)

    def read(self, arguments: Namespace, caller: Caller) -> tuple[AgentSession, ...]:
        return tuple(self.sessions.newest_sessions(arguments.agent_id, SESSION_LIMIT_ROWS))

    def write_output(self, value: object, output: Output) -> None:
        if not is_tuple(value):
            return
        rows = [self.row(session) for session in value if isinstance(session, AgentSession)]
        lines = ["  ".join(str(shown) for shown in (row["session"], row["program"], row["model"], row["started_at"], row["ended_at"], row["end_reason"] or (RUNNING_WORD if row["started_at"] else UNSTARTED_TEXT)) if shown) for row in rows]
        output.write("\n".join(lines) or EMPTY_HISTORY_TEXT, {"rows": rows})

    @staticmethod
    def row(session: AgentSession) -> dict[str, str | None]:
        return {"session": session.session, "program": session.program, "model": session.program_model, "started_at": session.started_at.text if session.started_at is not None else None,
                "ended_at": session.ended_at.text if session.ended_at is not None else None, "end_reason": session.end_reason or None}
