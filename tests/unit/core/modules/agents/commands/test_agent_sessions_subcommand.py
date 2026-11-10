from datetime import datetime, timezone
from types import SimpleNamespace

from core.modules.agents.commands.agent_sessions.agent_sessions_subcommand import EMPTY_HISTORY_TEXT, AgentSessionsSubcommand
from core.modules.agents.models.agent_session import AgentSession
from engine.time.timestamp import Timestamp

STARTED_AT = Timestamp(datetime(2026, 11, 11, 9, 0, tzinfo=timezone.utc))
ENDED_AT = Timestamp(datetime(2026, 11, 11, 10, 0, tzinfo=timezone.utc))
ENDED_SESSION = AgentSession(session_agent_id=4, session="s-1", program="claude", program_model="sonnet", started_at=STARTED_AT, ended_at=ENDED_AT, end_reason="cache_passed")
RUNNING_SESSION = AgentSession(session_agent_id=4, session="s-2", program="codex", started_at=ENDED_AT)


class OutputRecorder:
    """Keeps the text and the JSON value the subcommand wrote."""

    def __init__(self) -> None:
        self.text, self.data = "", {}

    def write(self, text: str, data: dict) -> None:
        self.text, self.data = text, data


def sessions_output(sessions: list[AgentSession]) -> OutputRecorder:
    subcommand = AgentSessionsSubcommand(SimpleNamespace(newest_sessions=lambda agent_id, limit: sessions))
    output = OutputRecorder()
    subcommand.write_output(subcommand.read(SimpleNamespace(agent_id=4), SimpleNamespace()), output)
    return output


def test_the_sessions_print_in_the_order_read_with_the_reason_or_running():
    output = sessions_output([RUNNING_SESSION, ENDED_SESSION])
    assert output.text.splitlines() == [f"s-2  codex  {ENDED_AT.text}  running", f"s-1  claude  sonnet  {STARTED_AT.text}  {ENDED_AT.text}  cache_passed"]


def test_the_json_rows_hold_each_field_and_an_empty_end_for_the_running_session():
    rows = sessions_output([RUNNING_SESSION, ENDED_SESSION]).data["rows"]
    assert rows[0] == {"session": "s-2", "program": "codex", "model": "", "started_at": ENDED_AT.text, "ended_at": None, "end_reason": None}
    assert (rows[1]["model"], rows[1]["ended_at"], rows[1]["end_reason"]) == ("sonnet", ENDED_AT.text, "cache_passed")


def test_an_agent_with_one_session_prints_one_line():
    assert len(sessions_output([RUNNING_SESSION]).text.splitlines()) == 1


def test_an_agent_with_no_session_says_so():
    assert sessions_output([]).text == EMPTY_HISTORY_TEXT
