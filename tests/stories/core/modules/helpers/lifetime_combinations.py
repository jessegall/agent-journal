from datetime import timedelta

import pytest

from core.modules.agents.models.agent import Agent
from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.helpers.support.helper_settings import COLD_SESSION_MINUTES, CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS
from engine.query.queries import Queries
from tests.stories.core.modules.helpers.cold_sessions import with_job
from tests.stories.core.modules.helpers.helper_jobs import JOB, helper_agent, resumable_session
from tests.stories.core.modules.helpers.support.rotating_helper import EndedColdRotationHelper, EndedContinueHelper, EndedEachLaunchHelper, real_program_states, story_with_profile_file
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.core.support.agent_labels import agent_number

LIMIT_TOKENS = 400000
UNAVAILABLE_TEXT = "The earlier conversation is unavailable"


@pytest.fixture
def steady(new_story):
    return story_with_profile_file(new_story, EndedContinueHelper)


@pytest.fixture
def cooling(new_story):
    return story_with_profile_file(new_story, EndedColdRotationHelper)


def launched_job(story) -> dict:
    launcher = FakeLauncher.listening(story.home.socket("launcher"), answer=b"started 701\n")
    story.expect_success(f'helper send {agent_number(story, helper_agent(story).id)} "{JOB}"', actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    launcher.server.close()
    story.home.socket("launcher").unlink()
    story.expect_rows(len(launcher.requests) == 1, detail=str(launcher.requests))
    return launcher.requests[0]


def test_a_continue_helper_whose_conversation_is_missing_starts_a_new_session_and_is_told_so(steady):
    helper = helper_agent(steady)
    command = " ".join(launched_job(steady)["command"])
    steady.expect_rows(helper_agent(steady).id == helper.id, helper_agent(steady).session != helper.session, UNAVAILABLE_TEXT in command, detail=command)


def test_a_continue_helper_past_the_context_limit_still_gets_a_new_session(steady, monkeypatch):
    steady.expect_success(f"setting set {CONTEXT_LIMIT_ENABLED} true --project", actor=steady.user)
    steady.expect_success(f"setting set {CONTEXT_LIMIT_TOKENS} {LIMIT_TOKENS} --project", actor=steady.user)
    helper = helper_agent(steady)
    resumable_session(steady, helper, monkeypatch)
    save_status_file(steady, helper.session, {"context_window": {"total_input_tokens": LIMIT_TOKENS}})
    request = launched_job(steady)
    steady.expect_rows(helper_agent(steady).session != helper.session, "--resume" not in request["command"], detail=str(request["command"][-4:]))


@pytest.mark.parametrize("fixture,minutes,percent", [(EndedColdRotationHelper, 1, 100), (EndedColdRotationHelper, 54, 80), (EndedColdRotationHelper, 300, 19), (EndedContinueHelper, 300, 80)])
def test_a_when_cold_helper_that_is_warm_or_small_and_a_continue_helper_that_is_cold_and_large_are_resumed(new_story, monkeypatch, fixture, minutes, percent):
    story = story_with_profile_file(new_story, fixture)
    helper, request = with_job(story, monkeypatch, minutes, percent)
    story.expect_rows(helper_agent(story).session == helper.session, "--resume" in request["command"], helper.session in request["command"], detail=str(request["command"][-4:]))


def test_a_when_cold_helper_that_is_cold_and_large_gets_a_new_session_on_its_program_and_number(cooling, monkeypatch):
    number = agent_number(cooling, helper_agent(cooling).id)
    helper, request = with_job(cooling, monkeypatch, 55, 20)
    current = helper_agent(cooling)
    cooling.expect_rows(current.session != helper.session, current.program == helper.program, request["command"][0] == "claude",
                        agent_number(cooling, current.id) == number, detail=str(request["command"][:2]))


def test_a_when_cold_helper_never_changes_program_while_its_own_is_out(cooling):
    helper = helper_agent(cooling)
    real_program_states(cooling)
    ends_at = (cooling.clock.timestamp().value + timedelta(minutes=30)).isoformat()
    cooling.expect_success(f'provider-outage make claude "rate limit" --ends-at {ends_at}', actor=cooling.agent)
    launcher = FakeLauncher.listening(cooling.home.socket("launcher"), answer=b"started 701\n")
    cooling.run(f'helper send {agent_number(cooling, helper.id)} "{JOB}"', actor=cooling.agent)
    cooling.run_listeners()
    launcher.drain_requests()
    cooling.expect_rows(helper_agent(cooling).program == "claude", not any(request["command"][0] == "codex" for request in launcher.requests), detail=str(launcher.requests))


def test_cold_minutes_at_zero_resumes_a_when_cold_helper_that_is_silent_and_large(cooling, monkeypatch):
    cooling.expect_success(f"setting set {COLD_SESSION_MINUTES} 0 --project", actor=cooling.user)
    helper, request = with_job(cooling, monkeypatch, 300, 100)
    cooling.expect_rows(helper_agent(cooling).session == helper.session, "--resume" in request["command"], detail=str(request["command"][-4:]))


def test_cold_minutes_at_zero_changes_nothing_for_an_each_launch_helper(new_story, monkeypatch):
    story = story_with_profile_file(new_story, EndedEachLaunchHelper)
    story.expect_success(f"setting set {COLD_SESSION_MINUTES} 0 --project", actor=story.user)
    helper, request = with_job(story, monkeypatch, 1, 10)
    story.expect_rows(helper_agent(story).session != helper.session, "--resume" not in request["command"], detail=str(request["command"][-4:]))


def test_an_each_launch_helper_sent_three_jobs_is_one_kept_agent(new_story):
    story = story_with_profile_file(new_story, EndedEachLaunchHelper)
    helper = helper_agent(story)
    sessions = [helper.session]
    for _ in range(3):
        launched_job(story)
        sessions.append(helper_agent(story).session)
        story.expect_success(f"agent end {helper.id}", actor=story.user)
        story.run_listeners()
    helpers = list(story.container.get(Queries).query(Agent).filter(role="helper").all_rows())
    story.expect_rows(len(helpers) == 1, len(set(sessions)) == 4, detail=str(sessions))
