import json
from datetime import timedelta

import pytest

from core.modules.helpers.support.cold_sessions import ColdSessions
from core.modules.helpers.support.helper_settings import COLD_SESSION_CONTEXT_PERCENT, COLD_SESSION_MINUTES, CONTEXT_LIMIT_ON, CONTEXT_LIMIT_TOKENS
from core.testing.fake_launcher import FakeLauncher
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


@pytest.mark.parametrize("percent", SMALL_PERCENTS + LARGE_PERCENTS)
@pytest.mark.parametrize("minutes", WARM_MINUTES)
def test_a_session_inside_the_cache_lifetime_is_never_cold(ended_helper, minutes, percent):
    aged(ended_helper, minutes, percent)
    ended_helper.expect_rows(not is_cold(ended_helper))


@pytest.mark.parametrize("percent", SMALL_PERCENTS)
@pytest.mark.parametrize("minutes", COLD_MINUTES)
def test_a_small_session_past_the_cache_lifetime_is_not_worth_starting_over(ended_helper, minutes, percent):
    aged(ended_helper, minutes, percent)
    ended_helper.expect_rows(not is_cold(ended_helper))


@pytest.mark.parametrize("percent", LARGE_PERCENTS)
@pytest.mark.parametrize("minutes", COLD_MINUTES)
def test_a_large_session_past_the_cache_lifetime_is_cold(ended_helper, minutes, percent):
    aged(ended_helper, minutes, percent)
    ended_helper.expect_rows(is_cold(ended_helper))


def test_a_session_with_no_reported_size_is_not_cold(ended_helper):
    ended_helper.advance(timedelta(minutes=300))
    ended_helper.expect_rows(not is_cold(ended_helper))


def test_the_size_of_an_ended_session_is_read_from_the_folder_it_moved_to(ended_helper):
    aged(ended_helper, 300, 60)
    session = helper_agent(ended_helper).session
    ended = ended_helper.home.status_folder / "ended"
    ended.mkdir(parents=True, exist_ok=True)
    (ended_helper.home.status_folder / f"{session}.json").rename(ended / f"{session}.json")
    ended_helper.expect_rows(is_cold(ended_helper))


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


def test_the_person_sets_the_context_size(ended_helper):
    ended_helper.expect_success(f"setting set {COLD_SESSION_CONTEXT_PERCENT} 50 --project", actor=ended_helper.user)
    aged(ended_helper, LIMIT_MINUTES, 49)
    ended_helper.expect_rows(not is_cold(ended_helper))
    for percent in (50, 51):
        full_status(ended_helper, helper_agent(ended_helper).session, percent, 0.0)
        ended_helper.expect_rows(is_cold(ended_helper))


def sent_a_job(story, monkeypatch, minutes, percent):
    helper = helper_agent(story)
    resumable_session(story, helper, monkeypatch)
    aged(story, minutes, percent)
    launcher = FakeLauncher(story.home.socket("launcher"), answer=b"started 701\n")
    story.expect_success(f'helper send {helper.id} "{JOB}"', actor=story.agent)
    story.run_listeners()
    launcher.wait_for_requests()
    return helper, launcher.requests[0]


def test_a_cold_helper_starts_a_new_session_under_the_same_agent_and_is_told_who_it_is(ended_helper, monkeypatch):
    helper, request = sent_a_job(ended_helper, monkeypatch, LIMIT_MINUTES, LIMIT_PERCENT)
    renewed = helper_agent(ended_helper)
    prompt = " ".join(request["command"])
    ended_helper.expect_rows(renewed.id == helper.id, renewed.session != helper.session, request["session"] == renewed.session, "--resume" not in request["command"],
                             renewed.session in request["command"], f"You are helper {helper.id}." in prompt, JOB in prompt, not is_cold(ended_helper), detail=str(request))


def test_a_warm_helper_resumes_its_own_session(ended_helper, monkeypatch):
    helper, request = sent_a_job(ended_helper, monkeypatch, LIMIT_MINUTES - 1, 100)
    ended_helper.expect_rows(helper_agent(ended_helper).session == helper.session, "--resume" in request["command"], helper.session in request["command"], detail=str(request))


def test_a_small_cold_helper_resumes_its_own_session(ended_helper, monkeypatch):
    helper, request = sent_a_job(ended_helper, monkeypatch, 300, LIMIT_PERCENT - 1)
    ended_helper.expect_rows(helper_agent(ended_helper).session == helper.session, "--resume" in request["command"], detail=str(request))


def test_a_helper_keeps_its_memories_when_it_starts_over(ended_helper, monkeypatch):
    helper = helper_agent(ended_helper)
    memory = ended_helper.new_row_id('memory make "The cart adds tax twice" --weight 5 --environment main', actor=ended_helper.user)
    sent_a_job(ended_helper, monkeypatch, LIMIT_MINUTES, LIMIT_PERCENT)
    ended_helper.expect_rows(helper_agent(ended_helper).id == helper.id)
    ended_helper.expect_text(f"memory read {memory}", "The cart adds tax twice", actor=ended_helper.user)


MAIN_SESSION = "s-1"
COLD_LIST = "helper cold-sessions claude --environment main --json"


def cold_rows(story):
    return json.loads(story.run(COLD_LIST, actor=story.user).output_text)["rows"]


@pytest.fixture
def main_session(new_story):
    return new_story(fixture=BuilderStarted)


@pytest.mark.parametrize("minutes, percent, listed", [(55, 20, True), (300, 100, True), (54, 100, False), (299, 19, False), (0, 0, False)],
                         ids=["at both limits", "long past both", "still warm", "too small", "fresh"])
def test_the_boot_menu_reads_which_main_sessions_went_cold(main_session, minutes, percent, listed):
    full_status(main_session, MAIN_SESSION, percent, 0.0)
    main_session.advance(timedelta(minutes=minutes))
    expected = [{"session": MAIN_SESSION, "context_percent": percent}] if listed else []
    main_session.expect_rows(cold_rows(main_session) == expected, detail=str(cold_rows(main_session)))


def test_the_boot_menu_reads_no_cold_session_of_another_program(main_session):
    full_status(main_session, MAIN_SESSION, 100, 0.0)
    main_session.advance(timedelta(minutes=300))
    main_session.expect_rows(json.loads(main_session.run("helper cold-sessions codex --environment main --json", actor=main_session.user).output_text)["rows"] == [])


def test_a_helper_past_the_context_limit_starts_a_new_session_when_it_is_sent_a_job(ended_helper, monkeypatch):
    ended_helper.expect_success(f"setting set {CONTEXT_LIMIT_ON} true --project", actor=ended_helper.user)
    ended_helper.expect_success(f"setting set {CONTEXT_LIMIT_TOKENS} 400000 --project", actor=ended_helper.user)
    helper = helper_agent(ended_helper)
    save_status_file(ended_helper, helper.session, {"context_window": {"total_input_tokens": 400000}})
    resumable_session(ended_helper, helper, monkeypatch)
    launcher = FakeLauncher(ended_helper.home.socket("launcher"), answer=b"started 701\n")
    ended_helper.expect_success(f'helper send {helper.id} "{JOB}"', actor=ended_helper.agent)
    ended_helper.run_listeners()
    launcher.wait_for_requests()
    ended_helper.expect_rows(helper_agent(ended_helper).session != helper.session, "--resume" not in launcher.requests[0]["command"], detail=str(launcher.requests[0]))
