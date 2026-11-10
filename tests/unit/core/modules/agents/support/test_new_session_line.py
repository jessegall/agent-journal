from contextlib import contextmanager
from types import SimpleNamespace

from core.modules.agents.support.new_session_line import NewSessionLine

AGENT = SimpleNamespace(id=7, number=4, environment_id=1)
CURRENT_SESSION = SimpleNamespace(end_reason="")
REPLACED_SESSION = SimpleNamespace(end_reason="cache_passed")
MISSING_CONVERSATION_SESSION = SimpleNamespace(end_reason="conversation_missing")


class FakeScopes:
    @contextmanager
    def row_scope(self, row: object):
        yield


def session_line(history: list, task_ids: tuple[int, ...] = (), report_id: int | None = None) -> str | None:
    sessions = SimpleNamespace(newest_sessions=lambda agent_id, limit: history[:limit])
    tasks = SimpleNamespace(open_task_ids=lambda agent_id: task_ids)
    reports = SimpleNamespace(newest_report_id=lambda agent_id: report_id)
    return NewSessionLine(sessions, tasks, reports, FakeScopes()).line(AGENT)


def test_the_line_names_the_agent_its_open_tasks_and_its_last_report():
    line = session_line([CURRENT_SESSION, REPLACED_SESSION], (12, 15), 3)
    assert line == ("You are a new session of agent 4. Your memories, your open tasks (task 12, task 15) and your last report (report 3) are carried;"
                    " the earlier conversation is not.")


def test_an_agent_with_no_task_and_no_report_reads_none_for_both():
    assert "your open tasks (none) and your last report (none)" in session_line([CURRENT_SESSION, REPLACED_SESSION])


def test_a_session_after_a_missing_conversation_is_told_it_is_unavailable():
    line = session_line([CURRENT_SESSION, MISSING_CONVERSATION_SESSION])
    assert line.endswith("are carried. The earlier conversation is unavailable.")


def test_the_first_session_of_an_agent_gets_no_line():
    assert session_line([CURRENT_SESSION]) is None
