from core.modules.agents.models.agent import Agent
from engine.time.timestamp import Timestamp


def agent(role: str, number: int, ended_at: Timestamp | None = None) -> Agent:
    return Agent(id=40, creator_id=1, session="s-1", program="claude", role=role, number=number, ended_at=ended_at)


def test_a_worker_shows_its_role_and_its_number_and_not_its_row_id():
    assert agent("worker", 5).display_name == "Worker 5"


def test_a_running_main_session_shows_as_the_main_agent_and_an_ended_one_as_a_previous_session():
    assert agent("main", 1).display_name == "Main agent"
    assert agent("main", 1, Timestamp.parsed("2026-01-01T00:00:00+00:00")).display_name == "Main agent, previous session"


def test_a_helper_with_a_profile_is_kept_until_it_is_retired_and_no_other_role_is():
    moment = Timestamp.parsed("2026-01-01T00:00:00+00:00")
    helper = Agent(id=41, creator_id=1, session="s-2", program="claude", role="helper", profile="journal-researcher", ended_at=moment)
    assert helper.is_kept_helper
    assert not helper.retired(moment, "its job is done", 1).is_kept_helper
    assert not Agent(id=42, creator_id=1, session="s-3", program="claude", role="helper").is_kept_helper
    assert not Agent(id=43, creator_id=1, session="s-4", program="claude", role="worker", profile="journal-worker").is_kept_helper
