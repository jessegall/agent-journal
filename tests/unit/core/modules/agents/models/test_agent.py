from core.modules.agents.models.agent import Agent
from engine.time.timestamp import Timestamp


def agent(role: str, number: int, ended_at: Timestamp | None = None) -> Agent:
    return Agent(id=40, creator_id=1, session="s-1", program="claude", role=role, number=number, ended_at=ended_at)


def test_a_worker_shows_its_role_and_its_number_and_not_its_row_id():
    assert agent("worker", 5).display_name == "Worker 5"


def test_the_main_agent_shows_as_the_main_agent_running_or_not():
    assert agent("main", 1).display_name == "Main agent"
    assert agent("main", 1, Timestamp.parsed("2026-01-01T00:00:00+00:00")).display_name == "Main agent"


def test_a_helper_with_a_profile_is_kept_until_it_is_retired_and_no_other_role_is():
    point = Timestamp.parsed("2026-01-01T00:00:00+00:00")
    helper = Agent(id=41, creator_id=1, session="s-2", program="claude", role="helper", profile="journal-researcher", ended_at=point)
    assert helper.is_kept_helper
    assert not helper.retired(point, "its job is done", 1).is_kept_helper
    assert not Agent(id=42, creator_id=1, session="s-3", program="claude", role="helper").is_kept_helper
    assert not Agent(id=43, creator_id=1, session="s-4", program="claude", role="worker", profile="journal-worker").is_kept_helper


def test_the_standing_a_row_records_is_read_without_a_launcher():
    point = Timestamp.parsed("2026-01-01T00:00:00+00:00")
    helper = Agent(id=44, creator_id=1, session="s-5", program="claude", role="helper", number=4)
    recorded = [row.standing.value for row in (
        helper, Agent(id=45, creator_id=1, session="s-6", program="claude", role="helper", number=5, launched_at=point),
        Agent(id=46, creator_id=1, session="s-7", program="claude", role="helper", number=6, pid=700), agent("main", 1),
        agent("helper", 7, point), Agent(id=47, creator_id=1, session="s-8", program="claude", role="helper", number=8, ended_at=point, launch_failed_at=point))]
    assert recorded == ["never_started", "running", "running", "running", "ended", "failed"]


def test_a_session_that_announced_itself_reads_running_and_a_helper_not_yet_launched_reads_never_started():
    point = Timestamp.parsed("2026-01-01T00:00:00+00:00")
    announced = Agent(id=48, creator_id=1, session="s-9", program="claude", role="helper", number=9, announced_at=point)
    unlaunched = Agent(id=49, creator_id=1, session="s-10", program="claude", role="helper", number=10)
    assert [announced.standing.value, unlaunched.standing.value] == ["running", "never_started"]
