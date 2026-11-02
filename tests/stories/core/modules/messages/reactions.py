from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.base.driver.support.samples import SAMPLES


def reaction_story(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.agent = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
    story.run('message send "Fix the cart" --environment main', actor=story.user)
    return story


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
    story.expect_absent_hook_line("s-1", HookSamples.stop(), "the user put")
    story.run('message react 1 "🎉"', actor=story.user)
    assert any("the user put 🎉 on message:1" in line for line in story.hook("s-1", HookSamples.stop()).lines)
    story.run('message react 1 "🎉"', actor=story.user)
    story.expect_absent_hook_line("s-1", HookSamples.stop(), "the user put")


def test_the_chat_feed_carries_the_faces(new_story):
    story = reaction_story(new_story)
    story.run('message react 1 "👍"', actor=story.user)
    story.expect_text("message feed --json", "actor_type", actor=story.user)
