import json
import shutil

import pytest

from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.helpers.support.helper_settings import COLD_SESSION_MINUTES
from tests.stories.core.modules.helpers.cold_sessions import with_job
from tests.stories.core.modules.helpers.helper_jobs import JOB, helper_agent, resumable_session
from tests.stories.core.modules.helpers.support.rotating_helper import EndedColdRotationHelper, EndedContinueHelper, EndedEachLaunchHelper, story_with_profile_file
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.core.support.agent_labels import agent_number

IDLE_MINUTES = 30
CONTEXT_PERCENT = 80
LAUNCH_COST = 0.4
LAUNCH_ROTATION_SAVE = EndedContinueHelper.save_line.replace("--occupant continue", "--occupant each-launch")


@pytest.fixture
def steady(new_story):
    return story_with_profile_file(new_story, EndedContinueHelper)


def reported_cost(story, session: str, spent_usd: float) -> None:
    save_status_file(story, session, {"context_window": {"used_percentage": 20}, "cost": {"total_cost_usd": spent_usd}})


def finished_job(story) -> None:
    """Sends the helper its next job, lets the launcher start it and ends the helper."""
    launcher = FakeLauncher.listening(story.home.socket("launcher"), answer=b"started 701\n")
    story.expect_success(f'helper send {agent_number(story, helper_agent(story).id)} "{JOB}"', actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    launcher.server.close()
    story.home.socket("launcher").unlink()
    story.expect_success(f"agent end {helper_agent(story).id}", actor=story.user)
    story.run_listeners()


def lifetimes(story, profile: str) -> dict:
    return json.loads(story.run(f"helper lifetimes {profile} --environment main --json", actor=story.user).output_text)


def launch_of_the_last_job(story) -> str:
    rows = json.loads(story.run("usage agents --closed --environment main --json", actor=story.user).output_text)["rows"]
    return next(row for row in rows if row["id"] == helper_agent(story).id)["occupant_launch"]


def test_a_person_reads_the_jobs_on_new_and_resumed_sessions_and_their_cost_with_no_word_on_which_is_cheaper(steady, monkeypatch):
    first = helper_agent(steady)
    resumable_session(steady, first, monkeypatch)
    reported_cost(steady, first.session, 1.0)
    finished_job(steady)
    reported_cost(steady, first.session, 1.5)
    shutil.rmtree(steady.home.folder.parent / "claude-config")
    finished_job(steady)
    second = helper_agent(steady)
    resumable_session(steady, second, monkeypatch)
    reported_cost(steady, second.session, 2.0)
    finished_job(steady)
    reported_cost(steady, second.session, 2.5)
    steady.expect_rows(second.session != first.session, lifetimes(steady, "steady") == {"jobs_total": 4, "jobs_fresh": 2, "jobs_resumed": 2, "cost_per_job_fresh": 1.5, "cost_per_job_resumed": 0.5},
                       detail=str(lifetimes(steady, "steady")))
    steady.expect_text("helper lifetimes steady --environment main", "2 jobs on a new session, $1.50 a job", "2 jobs on a resumed session, $0.50 a job", actor=steady.user)
    steady.expect_absent("helper lifetimes steady --environment main", "cheaper", "recommend", actor=steady.user)


def test_a_later_launch_of_an_each_launch_profile_costs_what_its_first_did(new_story):
    story = story_with_profile_file(new_story, EndedEachLaunchHelper)
    reported_cost(story, helper_agent(story).session, LAUNCH_COST)
    for _ in range(5):
        finished_job(story)
        reported_cost(story, helper_agent(story).session, LAUNCH_COST)
    story.expect_rows(lifetimes(story, "rotating") == {"jobs_total": 6, "jobs_fresh": 6, "jobs_resumed": 0, "cost_per_job_fresh": LAUNCH_COST, "cost_per_job_resumed": None},
                      detail=str(lifetimes(story, "rotating")))


def test_a_person_who_sets_a_profile_to_each_launch_sees_its_next_job_marked_fresh_in_the_agents_list(steady, monkeypatch):
    resumable_session(steady, helper_agent(steady), monkeypatch)
    finished_job(steady)
    resumed = launch_of_the_last_job(steady)
    steady.expect_success(LAUNCH_ROTATION_SAVE, actor=steady.user)
    finished_job(steady)
    steady.expect_rows((resumed, launch_of_the_last_job(steady)) == ("resumed", "fresh"), detail=resumed)


@pytest.mark.parametrize("fixture,minutes,new_session", [(EndedColdRotationHelper, 5, True), (EndedColdRotationHelper, 55, False), (EndedColdRotationHelper, 0, False),
                                                         (EndedContinueHelper, 5, False), (EndedContinueHelper, 55, False), (EndedContinueHelper, 0, False),
                                                         (EndedEachLaunchHelper, 5, True), (EndedEachLaunchHelper, 55, True), (EndedEachLaunchHelper, 0, True)])
def test_only_a_when_cold_profile_reads_the_cold_session_minutes_a_person_sets(new_story, monkeypatch, fixture, minutes, new_session):
    story = story_with_profile_file(new_story, fixture)
    story.expect_success(f"setting set {COLD_SESSION_MINUTES} {minutes} --project", actor=story.user)
    helper, request = with_job(story, monkeypatch, IDLE_MINUTES, CONTEXT_PERCENT)
    story.expect_rows((helper_agent(story).session != helper.session) is new_session, ("--resume" not in request["command"]) is new_session, detail=str(request["command"][-4:]))
