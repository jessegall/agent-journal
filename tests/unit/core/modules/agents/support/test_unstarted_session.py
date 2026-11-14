from types import SimpleNamespace

from core.modules.agents.support.agent_sessions import AgentSessions
from tests.unit.core.modules.agents.support.test_agent_sessions import CACHE_PASSED, CONTEXT, agent, sessions_with_store


def test_a_session_that_replaced_another_is_unstarted_until_its_program_is_launched():
    sessions, store = sessions_with_store()
    sessions.started(agent("s-1"), CONTEXT)
    assert not sessions.unstarted(agent("s-1"))
    sessions.replaced(agent("s-2"), CACHE_PASSED, CONTEXT)
    assert sessions.unstarted(agent("s-2")) and sessions.current(4).started_at is None
    sessions.launched(4, CONTEXT)
    assert not sessions.unstarted(agent("s-2")) and sessions.current(4).started_at is not None


def test_a_launch_changes_no_start_a_session_already_has_and_no_older_row():
    sessions, store = sessions_with_store()
    sessions.started(agent("s-1"), CONTEXT)
    first_started_at = sessions.current(4).started_at
    sessions.launched(4, CONTEXT)
    assert sessions.current(4).started_at == first_started_at
    sessions.replaced(agent("s-2"), CACHE_PASSED, CONTEXT)
    sessions.launched(4, CONTEXT)
    assert [row.started_at == first_started_at for row in store.rows] == [True, False]


def test_an_agent_with_no_history_is_not_unstarted():
    sessions, store = sessions_with_store()
    assert not sessions.unstarted(SimpleNamespace(id=9))


def test_an_unstarted_session_that_is_replaced_ends_as_never_started():
    sessions, store = sessions_with_store()
    sessions.started(agent("s-1"), CONTEXT)
    sessions.replaced(agent("s-2"), CACHE_PASSED, CONTEXT)
    sessions.replaced(agent("s-3"), CACHE_PASSED, CONTEXT)
    assert [(row.session, row.end_reason) for row in store.rows] == [("s-1", "cache_passed"), ("s-2", "never_started"), ("s-3", "")]
