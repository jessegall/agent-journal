import json
from datetime import timedelta

import pytest

from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.helpers.ticks.unstarted_job_starts import UnstartedJobStarts
from tests.stories.core.modules.helpers.helper_jobs import JOB, helper_agent, read_jobs, resumable_session
from tests.stories.core.modules.helpers.occupant_rotation import job_launch
from tests.stories.core.modules.helpers.support.rotating_helper import SAVE_ROTATING, EndedEachLaunchHelper, StartedEachLaunchHelper, real_program_states, story_with_profile_file
from tests.stories.core.support.agent_labels import agent_number

STEERING_TEXT = "Also read src/tax.py."
FIRST_BRIEF = "Read src/cart.py"


@pytest.fixture
def working(new_story):
    return story_with_profile_file(new_story, StartedEachLaunchHelper)


@pytest.fixture
def rotating(new_story, monkeypatch):
    story = story_with_profile_file(new_story, EndedEachLaunchHelper)
    resumable_session(story, helper_agent(story), monkeypatch)
    return story


def session_rows(story) -> list[dict]:
    number = agent_number(story, helper_agent(story).id)
    return json.loads(story.run(f"agent sessions {number} --environment main --json", actor=story.user).output_text)["rows"]


def steered(story) -> None:
    story.expect_success(f'helper send {agent_number(story, helper_agent(story).id)} --steer "{STEERING_TEXT}"', actor=story.agent)


def launches_after_the_program_died(story) -> list[dict]:
    launcher = FakeLauncher.accepting(story.home.socket("launcher"), answer=b"started 701\n")
    story.expect_success(f"agent end {helper_agent(story).id}", actor=story.user)
    story.run_listeners()
    launcher.drain_requests()
    launcher.server.close()
    story.home.socket("launcher").unlink()
    return [request for request in launcher.requests if "command" in request]


def test_a_steering_line_to_a_running_helper_joins_its_open_job_and_starts_no_new_occupant(working):
    helper = helper_agent(working)
    steered(working)
    jobs = read_jobs(working, helper)
    working.expect_rows(len(jobs) == 1, STEERING_TEXT in jobs[0].brief, helper_agent(working).session == helper.session, len(session_rows(working)) == 1)


@pytest.mark.parametrize("has_conversation", [True, False])
def test_a_helper_that_dies_in_a_job_resumes_its_session_or_gets_a_new_one_with_the_whole_brief(working, monkeypatch, has_conversation):
    helper = helper_agent(working)
    if has_conversation:
        resumable_session(working, helper, monkeypatch)
    steered(working)
    command = launches_after_the_program_died(working)[0]["command"]
    line = " ".join(command)
    working.expect_rows(helper_agent(working).id == helper.id, (helper_agent(working).session == helper.session) is has_conversation, ("--resume" in command) is has_conversation,
                        STEERING_TEXT in line, has_conversation or FIRST_BRIEF in line, detail=line)
    working.expect_absent("question list --environment main", "rotating", actor=working.user)


def test_a_paused_main_agent_that_resumes_gets_the_same_session_of_its_helper_back(working, monkeypatch):
    helper = helper_agent(working)
    resumable_session(working, helper, monkeypatch)
    working.expect_success(f"agent pause {agent_number(working, working.agent.id)}", actor=working.user)
    working.expect_success(f"agent end {helper.id}", actor=working.user)
    working.run_listeners()
    launcher = FakeLauncher.accepting(working.home.socket("launcher"), answer=b"started 701\n")
    working.expect_success(f"agent resume {agent_number(working, working.agent.id)}", actor=working.user)
    working.run_listeners()
    launcher.drain_requests()
    working.expect_rows(len(launcher.requests) == 1, helper_agent(working).session == helper.session, helper.session in launcher.requests[0]["command"], detail=str(launcher.requests))


def test_a_program_that_goes_out_in_a_job_makes_the_job_wait_never_changes_program_and_goes_on_once_the_outage_ends(working, monkeypatch):
    helper = helper_agent(working)
    real_program_states(working)
    resumable_session(working, helper, monkeypatch)
    steered(working)
    ends_at = (working.clock.timestamp().value + timedelta(minutes=30)).isoformat()
    working.expect_success(f'provider-outage make claude "rate limit" --ends-at {ends_at}', actor=working.agent)
    during_outage = launches_after_the_program_died(working)
    working.expect_rows(during_outage == [], helper_agent(working).program == "claude", read_jobs(working, helper)[0].ended_at is None, detail=str(during_outage))
    working.advance(timedelta(minutes=31))
    after_outage = launches_at_the_next_round(working)
    working.expect_rows(len(after_outage) == 1, any("--resume" in launch["command"] for launch in after_outage), helper_agent(working).session == helper.session,
                        read_jobs(working, helper)[0].ended_at is None, detail=str(after_outage))


def test_a_changed_occupant_leaves_the_open_job_alone_and_decides_the_next_launch(working, monkeypatch):
    helper = helper_agent(working)
    working.expect_success(SAVE_ROTATING.replace("--occupant each-launch", "--occupant continue"), actor=working.user)
    jobs = read_jobs(working, helper)
    working.expect_rows(len(jobs) == 1, jobs[0].ended_at is None, FIRST_BRIEF in jobs[0].brief, helper_agent(working).session == helper.session)
    working.expect_success(f"agent end {helper.id}", actor=working.user)
    working.run_listeners()
    resumable_session(working, helper, monkeypatch)
    command = job_launch(working)["command"]
    working.expect_rows("--resume" in command, helper_agent(working).session == helper.session, detail=str(command[-4:]))


def test_a_second_send_while_the_first_job_is_open_is_refused_and_only_one_occupant_is_made(rotating):
    helper = helper_agent(rotating)
    job_launch(rotating)
    rotating.expect_refusal(f'helper send {agent_number(rotating, helper.id)} "A second job"', "--steer", actor=rotating.agent)
    rows = session_rows(rotating)
    rotating.expect_rows(len(rows) == 2, rows[1]["end_reason"] == "each_launch", rows[0]["session"] == helper_agent(rotating).session, detail=str(rows))


def test_a_stopped_helper_ends_its_job_as_stopped_and_the_next_send_makes_a_new_occupant(working, monkeypatch):
    helper = helper_agent(working)
    resumable_session(working, helper, monkeypatch)
    working.expect_success(f"helper stop {agent_number(working, helper.id)}", actor=working.user)
    working.run_listeners()
    working.expect_rows(read_jobs(working, helper)[0].returned == "Stopped", detail=str(read_jobs(working, helper)[0]))
    command = job_launch(working)["command"]
    working.expect_rows(helper_agent(working).session != helper.session, "--resume" not in command, detail=str(command[-4:]))


def launches_at_the_next_round(story) -> list[dict]:
    launcher = FakeLauncher.accepting(story.home.socket("launcher"), answer=b"started 702\n")
    UnstartedJobStarts()(story.container)
    story.run_listeners()
    launcher.drain_requests()
    launcher.server.close()
    story.home.socket("launcher").unlink()
    return [request for request in launcher.requests if "command" in request]
