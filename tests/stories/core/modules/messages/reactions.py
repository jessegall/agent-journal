from core.testing.expect_reply import expect_reply_line
from core.testing.story_fixture import StoryFixture

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.messages.commands.react_message.react_message_handler import REACTION_SOURCE
from core.testing.hook_samples import HookSamples
from tests.stories.engine.driver.support.fixtures import SampleSuiteChoice
from tests.stories.engine.driver.support.hook_agents import hook_agent
from tests.stories.engine.driver.support.samples import SAMPLES


class ReactableMessage(StoryFixture):
    parent = SampleSuiteChoice

    def steps(self, story):
        story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
        story.agent = hook_agent(story, story.hook('s-1', HookSamples.session_start()))
        story.run('message send "Fix the cart" --environment main', actor=story.user)


def reaction_story(new_story):
    return new_story(SAMPLES, fixture=ReactableMessage)


def test_a_face_goes_on_and_the_same_face_again_takes_it_off(new_story):
    story = reaction_story(new_story)
    story.expect_text('message react 1 "👍"', "message 1: 👍", actor=story.agent)
    story.expect_text('message react 1 "🎉"', "message 1: 👍 🎉", actor=story.agent)
    story.expect_text('message react 1 "👍"', "message 1: 🎉", actor=story.agent)


def test_two_actors_keep_their_own_face(new_story):
    story = reaction_story(new_story)
    story.run('message react 1 "👍"', actor=story.agent)
    story.expect_text('message react 1 "👍"', "message 1: 👍 👍", actor=story.user)


def test_words_are_no_face(new_story):
    story = reaction_story(new_story)
    story.expect_refusal('message react 1 "nice"', "nice is no face", actor=story.agent)


def test_the_agent_is_told_of_a_face_the_user_puts_on_but_not_of_its_own_or_one_taken_off(new_story):
    story = reaction_story(new_story)
    story.hook("s-1", HookSamples.stop())
    story.run('message react 1 "👍"', actor=story.agent)
    story.expect_absent_hook_line("s-1", HookSamples.stop(), "the user reacted")
    story.run('message react 1 "🎉"', actor=story.user)
    expect_reply_line(story.hook("s-1", HookSamples.stop()), "the user reacted to message:1")
    story.run('message react 1 "🎉"', actor=story.user)
    story.expect_absent_hook_line("s-1", HookSamples.stop(), "the user reacted")


def test_a_face_the_user_puts_on_wakes_the_agent(new_story):
    story = reaction_story(new_story)
    story.run('message react 1 "🎉"', actor=story.user)
    line = next(story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id, source=REACTION_SOURCE).all_rows())
    story.expect_rows(line.wakes_agent)


def test_the_chat_feed_carries_the_faces(new_story):
    story = reaction_story(new_story)
    story.run('message react 1 "👍"', actor=story.user)
    story.expect_text("message feed --json", "actor_type", actor=story.user)
