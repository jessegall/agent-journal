import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.chat.support.mark_samples import expect_absent_marks_text, expect_marks_text
from tests.stories.core.modules.sequences.sequences import ReleaseSequence


class ActiveRelease(StoryFixture):
    parent = ReleaseSequence

    def steps(self, story):
        story.expect_success("sequence run 1", actor=story.agent)
        story.expect_success("sequence follow", actor=story.agent)


class HelperActiveRelease(StoryFixture):
    parent = ReleaseSequence

    def steps(self, story):
        helper = Actor(story.new_row_id(f"agent start s-2 claude helper --parent {story.agent.id} --environment main"), ActorType.AGENT)
        story.expect_success("sequence run 1", actor=helper)
        story.expect_success("sequence follow", actor=helper)


def test_finishing_the_last_step_shows_a_mark_but_moving_a_step_does_not(new_story):
    story = new_story(fixture=ActiveRelease)
    story.expect_success("sequence next", actor=story.agent)
    story.run_listeners()
    expect_marks_text(story, "Sequence 1 started: Release")
    expect_absent_marks_text(story, "Sequence 1 finished: Release")
    expect_absent_marks_text(story, "Sequence 1 given up: Release")
    story.expect_success("sequence follow", actor=story.agent)
    story.expect_success("sequence next", actor=story.agent)
    story.run_listeners()
    expect_marks_text(story, "Sequence 1 finished: Release")


def test_giving_up_a_sequence_shows_a_mark(new_story):
    story = new_story(fixture=ActiveRelease)
    story.expect_success('sequence abandon --why "not today" --sure', actor=story.agent)
    story.run_listeners()
    expect_marks_text(story, "Sequence 1 given up: Release")
    expect_absent_marks_text(story, "Sequence 1 finished: Release")


@pytest.mark.parametrize("action", ["finish", "abandon"])
def test_another_agent_ending_a_sequence_shows_no_mark(new_story, action):
    story = new_story(fixture=HelperActiveRelease)
    helper = Actor(story.container.get(Queries).query(Agent).filter(session="s-2").first().id, ActorType.AGENT)
    if action == "finish":
        story.expect_success("sequence next", actor=helper)
        story.expect_success("sequence follow", actor=helper)
        story.expect_success("sequence next", actor=helper)
    else:
        story.expect_success('sequence abandon --why "not today" --sure', actor=helper)
    story.run_listeners()
    expect_absent_marks_text(story, "Sequence 1 started: Release")
    expect_absent_marks_text(story, "Sequence 1 finished: Release")
    expect_absent_marks_text(story, "Sequence 1 given up: Release")
