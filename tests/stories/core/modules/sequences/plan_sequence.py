from engine.testing.stories.story_fixture import StoryFixture

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.query.queries import Queries
from core.modules.sequences.models.sequence_run import SequenceRun
from server.work.booting_work import BootingWork
from tests.stories.core.modules.chat.support.mark_samples import expect_absent_marks_text, expect_marks_text
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import UserBuilder

PLAN_SEQUENCE = "Building a plan"


class StandardSequences(StoryFixture):
    parent = UserBuilder

    def steps(self, story):
        story.run_listeners()
        BootingWork().run(story.container)
        story.run_listeners()


def read_worker(story) -> Actor:
    return Actor(story.new_row_id("agent start s-worker claude worker --environment main"), ActorType.AGENT)


def run_agent_ids(story) -> list[int]:
    return [run.session_agent_id for run in story.container.get(Queries).query(SequenceRun).all_rows()]


def test_the_main_agent_making_a_plan_follows_the_plan_sequence_and_the_chat_shows_a_mark(new_story):
    story = new_story(fixture=StandardSequences)
    story.run(lines.NEW_PLAN, actor=story.agent)
    story.run_listeners()
    expect_run_agents(story, [story.agent.id])
    story.expect_text("sequence-run list", PLAN_SEQUENCE, actor=story.agent)
    expect_marks_text(story, PLAN_SEQUENCE)


def test_a_worker_making_a_plan_follows_the_plan_sequence_and_the_chat_shows_no_mark(new_story):
    story = new_story(fixture=StandardSequences)
    worker = read_worker(story)
    story.run(lines.NEW_PLAN, actor=worker)
    story.run_listeners()
    expect_run_agents(story, [worker.id])
    story.expect_text("sequence-run list", PLAN_SEQUENCE, actor=worker)
    expect_absent_marks_text(story, PLAN_SEQUENCE)


def test_a_helper_making_a_plan_follows_the_plan_sequence_and_the_chat_shows_no_mark(new_story):
    story = new_story(fixture=StandardSequences, environment="main")
    helper = Actor(story.new_row_id(f"agent start s-2 claude helper --parent {story.agent.id}"), ActorType.AGENT)
    story.run(lines.NEW_PLAN, actor=helper)
    story.run_listeners()
    expect_run_agents(story, [helper.id])
    expect_absent_marks_text(story, PLAN_SEQUENCE)


def expect_open_run_agents(story, expected) -> None:
    actual = [run.session_agent_id for run in story.container.get(Queries).query(SequenceRun).all_rows() if run.ended_at is None]
    assert actual == expected, actual


def expect_run_agents(story, expected) -> None:
    actual = run_agent_ids(story)
    assert actual == expected, actual
