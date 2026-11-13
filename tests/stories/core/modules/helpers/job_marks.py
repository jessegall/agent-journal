from core.modules.agents.testing.fake_launcher import FakeLauncher
from tests.stories.core.modules.documents.delegated_sources import scenario  # noqa: F401
from tests.stories.core.modules.helpers.helper_jobs import JOB, EndedHelper, helper_agent, resumable_session
from tests.stories.core.support.agent_labels import agent_label, agent_number
from suites.coding.support.shipped_profiles import PLANNER_PROFILE
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE

"""A helper's job shows its own mark in the chat: Started for its first job, Steered for a line sent to it while it runs, Sent a job for the next job of a helper that had ended."""

MARKS = "chat-mark list --environment main"
STEERING = "Now plan the original request"


def test_a_steer_to_a_running_helper_shows_a_steered_mark_and_not_a_started_one(scenario):  # noqa: F811
    story = scenario.story
    helper = helper_agent(story)
    scenario.switch(1)
    scenario.command(f'helper send {agent_number(story, helper.id)} "{STEERING}" --steer')
    story.run_listeners()
    story.expect_text(MARKS, f"Steered {agent_label(story, helper.id)}: {STEERING}", f"Started {PLANNER_PROFILE.name}")
    story.expect_no_text(MARKS, f"Started {PLANNER_PROFILE.name} . sonnet: {STEERING}")


def test_a_next_job_for_an_ended_helper_shows_a_sent_a_job_mark(new_story, monkeypatch):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    resumable_session(story, helper, monkeypatch)
    story.expect_success(f'helper send {agent_number(story, helper.id)} "{JOB}"', actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    story.expect_text(MARKS, f"Sent {agent_label(story, helper.id)} a job: {JOB}")
    story.expect_no_text(MARKS, f"Started {RESEARCHER_PROFILE.name}")
