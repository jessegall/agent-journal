import json
from datetime import timedelta

import pytest

from core.modules.helpers.support.cold_sessions import ColdSessions
from core.modules.helpers.support.helper_resume import HelperResume
from core.modules.helpers.errors.stale_session_error import StaleSessionError
from core.modules.helpers.support.helper_settings import COLD_SESSION_CONTEXT_PERCENT, COLD_SESSION_MINUTES, CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS
from core.modules.agents.testing.fake_launcher import FakeLauncher
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, JOB, helper_agent, resumable_session
from tests.stories.core.modules.usage.support.status_files import full_status, save_status_file
from tests.stories.core.support.coding_fixtures import BuilderStarted

LIMIT_MINUTES = 55
LIMIT_PERCENT = 20
WARM_MINUTES = [0, 1, 30, 54]
COLD_MINUTES = [55, 56, 60, 61, 120, 300]
SMALL_PERCENTS = [0, 1, 10, 19]
LARGE_PERCENTS = [20, 21, 50, 59, 80, 100]


def is_cold(story):
    return story.container.get(ColdSessions).is_cold(helper_agent(story))


def aged(story, minutes, percent):
    full_status(story, helper_agent(story).session, percent, 0.0)
    story.advance(timedelta(minutes=minutes))


@pytest.fixture
def ended_helper(new_story):
    return new_story(fixture=EndedHelper)


@pytest.mark.parametrize("setting", [COLD_SESSION_MINUTES, COLD_SESSION_CONTEXT_PERCENT])
def test_either_limit_at_zero_turns_the_check_off(ended_helper, setting):
    aged(ended_helper, 300, 100)
    ended_helper.expect_success(f"setting set {setting} 0 --project", actor=ended_helper.user)
    ended_helper.expect_rows(not is_cold(ended_helper))


@pytest.mark.parametrize("minutes, cold", [(9, False), (10, True), (11, True)])
def test_the_person_sets_the_cache_lifetime(ended_helper, minutes, cold):
    ended_helper.expect_success(f"setting set {COLD_SESSION_MINUTES} 10 --project", actor=ended_helper.user)
    aged(ended_helper, minutes, LIMIT_PERCENT)
    ended_helper.expect_rows(is_cold(ended_helper) is cold)


def with_job(story, monkeypatch, minutes, percent):
    helper = helper_agent(story)
    resumable_session(story, helper, monkeypatch)
    aged(story, minutes, percent)
    launcher = FakeLauncher.listening(story.home.socket("launcher"), answer=b"started 701\n")
    story.expect_success(f'helper send {helper.id} "{JOB}"', actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    return helper, launcher.requests[0]


def test_a_cold_helper_starts_a_new_session_under_the_same_agent_and_is_told_who_it_is(ended_helper, monkeypatch):
    helper, request = with_job(ended_helper, monkeypatch, LIMIT_MINUTES, LIMIT_PERCENT)
    replaced = helper_agent(ended_helper)
    prompt = " ".join(request["command"])
    ended_helper.expect_rows(replaced.id == helper.id, replaced.session != helper.session, request["session"] == replaced.session, "--resume" not in request["command"],
                             replaced.session in request["command"], f"You are helper {helper.id}." in prompt, JOB in prompt, not is_cold(ended_helper), detail=str(request))


def test_a_warm_helper_resumes_its_own_session(ended_helper, monkeypatch):
    helper, request = with_job(ended_helper, monkeypatch, LIMIT_MINUTES - 1, 100)
    ended_helper.expect_rows(helper_agent(ended_helper).session == helper.session, "--resume" in request["command"], helper.session in request["command"], detail=str(request))


def test_a_small_cold_helper_resumes_its_own_session(ended_helper, monkeypatch):
    helper, request = with_job(ended_helper, monkeypatch, 300, LIMIT_PERCENT - 1)
    ended_helper.expect_rows(helper_agent(ended_helper).session == helper.session, "--resume" in request["command"], detail=str(request))


def test_a_helper_keeps_its_memories_when_it_starts_over(ended_helper, monkeypatch):
    helper = helper_agent(ended_helper)
    memory = ended_helper.new_row_id('memory make "The cart adds tax twice" --weight 5 --environment main', actor=ended_helper.user)
    with_job(ended_helper, monkeypatch, LIMIT_MINUTES, LIMIT_PERCENT)
    ended_helper.expect_rows(helper_agent(ended_helper).id == helper.id)
    ended_helper.expect_text(f"memory read {memory}", "The cart adds tax twice", actor=ended_helper.user)


MAIN_SESSION = "s-1"
COLD_LIST = "helper cold-sessions claude --environment main --json"


@pytest.fixture
def main_session(new_story):
    return new_story(fixture=BuilderStarted)


def test_the_boot_menu_reads_no_cold_session_of_another_program(main_session):
    full_status(main_session, MAIN_SESSION, 100, 0.0)
    main_session.advance(timedelta(minutes=300))
    main_session.expect_rows(json.loads(main_session.run("helper cold-sessions codex --environment main --json", actor=main_session.user).output_text)["rows"] == [])


@pytest.fixture
def limited_helper(ended_helper):
    ended_helper.expect_success(f"setting set {CONTEXT_LIMIT_ENABLED} true --project", actor=ended_helper.user)
    ended_helper.expect_success(f"setting set {CONTEXT_LIMIT_TOKENS} 400000 --project", actor=ended_helper.user)
    save_status_file(ended_helper, helper_agent(ended_helper).session, {"context_window": {"total_input_tokens": 400000}})
    return ended_helper


def test_a_limited_helper_starts_a_new_session_when_it_is_sent_a_job(limited_helper, monkeypatch):
    story, helper = limited_helper, helper_agent(limited_helper)
    resumable_session(story, helper, monkeypatch)
    launcher = FakeLauncher.listening(story.home.socket("launcher"), answer=b"started 701\n")
    story.expect_success(f'helper send {helper.id} "{JOB}"', actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    story.expect_rows(helper_agent(story).session != helper.session, "--resume" not in launcher.requests[0]["command"], detail=str(launcher.requests[0]))


def test_a_limited_helper_starts_its_new_session_again_when_the_launcher_still_holds_its_program(limited_helper):
    story = limited_helper
    launcher = FakeLauncher.listening(story.home.socket("launcher"), request_count=2, answers=(b"running\n", b"started 701\n"))
    resume = story.container.get(HelperResume)
    resume.resume(helper_agent(story), JOB)
    resume.resume(helper_agent(story), JOB)
    session = helper_agent(story).session
    first, second = launcher.requests[0]["command"], launcher.requests[1]["command"]
    story.expect_rows("--session-id" in first, "--session-id" in second, session in second, "--resume" not in first, "--resume" not in second, detail=str(launcher.requests))


def test_a_session_whose_last_message_is_over_an_hour_old_may_not_be_resumed(ended_helper):
    ended_helper.advance(timedelta(minutes=61))
    with pytest.raises(StaleSessionError):
        ended_helper.container.get(ColdSessions).require_replaced(helper_agent(ended_helper))


def test_a_session_whose_last_message_is_under_an_hour_old_may_be_resumed(ended_helper):
    ended_helper.advance(timedelta(minutes=59))
    ended_helper.container.get(ColdSessions).require_replaced(helper_agent(ended_helper))
