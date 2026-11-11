from datetime import timedelta

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.journal.journal_home import LAUNCHER_SOCKET
from core.modules.agents.models.agent import Agent
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent
from tests.stories.core.modules.helpers.helper_reports import stop_with_report
from tests.stories.core.support.agent_labels import agent_number

PROGRAM_RUNS = b"running\n"
ENDED = "ended_at: 20"
CORRECTION = "was ended while its program runs: its row is open again"


@pytest.fixture
def running_helper(new_story):
    """A helper whose program the launcher holds: the launcher answers every request about it with running."""
    story = new_story(fixture=StartedHelper)
    story.helper = Actor(helper_agent(story).id, ActorType.AGENT)
    story.launcher = FakeLauncher.listening(story.home.socket(LAUNCHER_SOCKET), answer=PROGRAM_RUNS, request_count=0)
    yield story
    story.launcher.server.close()


def shown(story) -> str:
    return story.run(f"agent show {agent_number(story, story.helper.id)} --environment main", actor=story.user).output_text


def test_543_the_row_of_an_agent_whose_program_runs_is_not_ended_by_its_report_or_by_the_session_end_of_an_earlier_program_and_ends_when_the_program_is_gone(running_helper):
    story = running_helper
    session = story.row(Agent, story.helper.id).session
    story.hook(session, stop_with_report("The cart adds tax twice."))
    story.expect_rows(ENDED not in shown(story), detail="the hook that brings its report does not end the row")
    story.hook(session, HookSamples.sample("session_end"))
    story.run_listeners()
    story.expect_rows(ENDED not in shown(story), detail=f"the launcher still holds the program, and the row says: {shown(story)}")
    story.expect_success(f"agent exited {story.helper.id} 0", actor=story.user)
    story.expect_rows(ENDED in shown(story), detail=shown(story))


def test_545_a_row_ended_while_its_program_runs_is_opened_again_within_one_tick_and_the_correction_is_recorded(running_helper):
    story = running_helper
    story.expect_success(f"agent end {story.helper.id}", actor=Actor.core())
    story.advance(timedelta(minutes=1))
    story.tick(story.row(Agent, story.agent.id).session)
    story.run_listeners()
    story.expect_rows(ENDED not in shown(story), CORRECTION in story.system_log_text(), detail=f"{shown(story)} | {story.system_log_text()[-400:]}")
