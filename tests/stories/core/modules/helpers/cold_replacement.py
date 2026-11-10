from datetime import timedelta

import pytest

from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS
from tests.stories.core.modules.helpers.cold_sessions import with_job
from tests.stories.core.modules.helpers.helper_jobs import helper_agent, resumable_session
from tests.stories.core.modules.helpers.lifetime_combinations import launched_job
from tests.stories.core.modules.helpers.rotation_mid_job import session_rows
from tests.stories.core.modules.helpers.support.rotating_helper import EndedColdRotationHelper, story_with_profile_file
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.core.support.agent_labels import agent_number

SILENT_MINUTES = 180
LIMIT_TOKENS = 400000


@pytest.fixture
def cooling(new_story):
    return story_with_profile_file(new_story, EndedColdRotationHelper)


def test_a_helper_silent_for_three_hours_with_a_large_context_gets_a_new_session_and_its_history_says_why(cooling, monkeypatch):
    number = agent_number(cooling, helper_agent(cooling).id)
    memory = cooling.new_row_id('memory make "The cart adds tax twice" --weight 5 --environment main', actor=cooling.user)
    helper, request = with_job(cooling, monkeypatch, SILENT_MINUTES, 40)
    current, rows, folders = helper_agent(cooling), session_rows(cooling), cooling.container.get(AgentFolders)
    cooling.expect_rows(current.id == helper.id, agent_number(cooling, current.id) == number, current.session != helper.session, folders.folder(current) == folders.folder(helper),
                        "--resume" not in request["command"], detail=str(request))
    cooling.expect_rows([(row["session"], row["end_reason"]) for row in rows] == [(current.session, None), (helper.session, "cache_passed")], detail=str(rows))
    cooling.expect_text(f"memory read {memory}", "The cart adds tax twice", actor=cooling.user)


def test_a_helper_silent_for_three_hours_with_a_small_context_resumes_its_session_and_adds_no_history(cooling, monkeypatch):
    helper, request = with_job(cooling, monkeypatch, SILENT_MINUTES, 5)
    rows = session_rows(cooling)
    cooling.expect_rows(helper_agent(cooling).session == helper.session, "--resume" in request["command"], [row["session"] for row in rows] == [helper.session], detail=str(rows))


def test_an_idle_helper_that_gets_no_job_for_a_day_keeps_its_session_and_its_history(cooling):
    helper, rows = helper_agent(cooling), session_rows(cooling)
    cooling.advance(timedelta(days=1))
    cooling.run_listeners()
    current = helper_agent(cooling)
    cooling.expect_rows(current.session == helper.session, current.retired_at is None, session_rows(cooling) == rows, detail=str(session_rows(cooling)))


def test_a_helper_past_the_context_limit_is_replaced_at_its_next_job_and_its_history_says_context_limit(cooling, monkeypatch):
    cooling.expect_success(f"setting set {CONTEXT_LIMIT_ENABLED} true --project", actor=cooling.user)
    cooling.expect_success(f"setting set {CONTEXT_LIMIT_TOKENS} {LIMIT_TOKENS} --project", actor=cooling.user)
    helper = helper_agent(cooling)
    resumable_session(cooling, helper, monkeypatch)
    save_status_file(cooling, helper.session, {"context_window": {"total_input_tokens": LIMIT_TOKENS}})
    request = launched_job(cooling)
    rows = session_rows(cooling)
    cooling.expect_rows(helper_agent(cooling).session != helper.session, "--resume" not in request["command"],
                        [row["end_reason"] for row in rows] == [None, "context_limit"], detail=str(rows))
