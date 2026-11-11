from datetime import timedelta

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.journal.journal_home import LAUNCHER_SOCKET
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.drivers.models.agent_line import AgentLine
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent, resumable_session
from tests.stories.core.modules.usage.support.status_files import full_status
from tests.stories.core.support.agent_labels import agent_number

MESSAGE = 'message send "Look at src/cart.py again" --to agent:{number} --environment main'


@pytest.fixture
def helper_story(new_story):
    story = new_story(fixture=StartedHelper)
    story.helper = Actor(helper_agent(story).id, ActorType.AGENT)
    story.launcher = FakeLauncher.listening(story.home.socket(LAUNCHER_SOCKET), answer=b"started 4242\n")
    yield story
    story.launcher.server.close()


def program_starts(story) -> list[dict[str, object]]:
    story.run_listeners()
    story.launcher.drain_requests()
    return [start for start in story.launcher.starts if start["agent_id"] == story.helper.id]


def program_starts_so_far(story) -> list[dict[str, object]]:
    story.run_listeners()
    return [start for start in story.launcher.starts if start["agent_id"] == story.helper.id]


def helper_row(story) -> Agent:
    return story.container.get(Queries).query(Agent).filter(id=story.helper.id).first()


def test_a_message_to_an_idle_agent_is_a_line_that_wakes_it_and_starts_no_second_program(helper_story):
    story = helper_story
    story.advance(timedelta(minutes=20))
    story.expect_success(MESSAGE.format(number=agent_number(story, story.helper.id)), actor=story.agent)
    line = story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.helper.id).newest().first()
    story.expect_rows(line.wakes_agent, program_starts_so_far(story) == [], detail=str(story.launcher.requests))


def test_a_message_to_a_stopped_agent_starts_its_program_again_in_the_same_journal_session(helper_story, monkeypatch):
    story = helper_story
    before_stop = helper_row(story)
    resumable_session(story, before_stop, monkeypatch)
    story.expect_success(f"agent end {story.helper.id}", actor=story.helper)
    story.advance(timedelta(minutes=5))
    story.expect_success(MESSAGE.format(number=agent_number(story, story.helper.id)), actor=story.agent)
    starts = program_starts(story)
    story.expect_rows(len(starts) == 1, starts[0]["session"] == before_stop.session, "--resume" in starts[0]["command"], helper_row(story).id == before_stop.id, detail=str(story.launcher.requests))


def test_a_message_to_a_stopped_agent_whose_session_has_gone_cold_starts_a_new_program_under_the_same_agent(helper_story, monkeypatch):
    story = helper_story
    before_stop = helper_row(story)
    resumable_session(story, before_stop, monkeypatch)
    story.expect_success('memory make "The cart rounds half up" --weight 5', actor=story.helper)
    story.expect_success(f"agent end {story.helper.id}", actor=story.helper)
    full_status(story, before_stop.session, 40, 0.0)
    story.advance(timedelta(minutes=61))
    story.expect_success(MESSAGE.format(number=agent_number(story, story.helper.id)), actor=story.agent)
    starts = program_starts(story)
    story.expect_rows(len(starts) == 1, "--resume" not in starts[0]["command"], helper_row(story).session != before_stop.session, helper_row(story).id == before_stop.id, detail=str(story.launcher.requests))
    story.expect_text("memory list", "The cart rounds half up", actor=story.helper)


def test_a_message_to_a_retired_agent_is_refused_and_wakes_nothing(helper_story):
    story = helper_story
    story.expect_success(f"agent end {story.helper.id}", actor=story.helper)
    story.expect_success(f'agent retire {agent_number(story, story.helper.id)} --reason "its job is done"')
    story.expect_refusal(MESSAGE.format(number=agent_number(story, story.helper.id)), "is retired", actor=story.agent)
    story.expect_rows(program_starts_so_far(story) == [], detail=str(story.launcher.requests))
