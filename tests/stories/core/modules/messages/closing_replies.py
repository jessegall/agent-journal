from datetime import timedelta

from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from tests.stories.core.support.coding_fixtures import UserBuilder

CLOSING = "I fixed the cart total and the stories pass."
STEP = timedelta(seconds=5)
FIXTURE_TIME = timedelta(minutes=1)


def person_message(story: Story, text: str) -> None:
    story.expect_success(f'message send "{text}" --environment main', actor=story.user)
    story.advance(STEP)


def story_after_fixture(new_story, fixture: type[StoryFixture]) -> Story:
    """A story starts at the first second again, so it moves past the times its fixture's rows carry."""
    story = new_story(fixture=fixture)
    story.advance(FIXTURE_TIME)
    return story


def agent_messages(story: Story) -> list[Message]:
    return list(story.story_rows(Message, type=MessageType.AGENT))


class MessageToStoppedAgent(StoryFixture):
    """The agent ended its turn, then a user wrote message 1 and the journal's line for it started a new turn."""

    parent = UserBuilder

    def steps(self, story: Story) -> None:
        story.hook("s-1", HookSamples.stop())
        story.advance(STEP)
        person_message(story, "Is the cart done?")
        story.hook("s-1", HookSamples.prompt("[journal] New message 1: read it"))
        story.advance(STEP)


class MessageDuringTurn(StoryFixture):
    """The agent works in a turn that a journal line started, and a user writes message 1 in the middle of it."""

    parent = UserBuilder

    def steps(self, story: Story) -> None:
        story.hook("s-1", HookSamples.prompt("[journal] task 1 is yours"))
        story.hook("s-1", HookSamples.edit("src/cart.py"))
        story.advance(STEP)
        person_message(story, "Is the cart done?")


def test_the_closing_text_of_a_turn_is_no_reply_to_a_message_that_came_during_it(new_story):
    story = story_after_fixture(new_story, MessageDuringTurn)
    story.hook("s-1", HookSamples.message_display(CLOSING))
    story.hook("s-1", HookSamples.stop())
    closing = agent_messages(story)[0]
    story.expect_rows(closing.text == CLOSING, closing.parent_id is None, detail=str(agent_messages(story)))


def test_a_message_read_and_answered_in_the_turn_is_linked_only_by_the_reply_command(new_story):
    story = story_after_fixture(new_story, MessageDuringTurn)
    story.expect_success('message reply 1 "Not yet, the stories still run."', actor=story.agent)
    story.advance(STEP)
    story.hook("s-1", HookSamples.message_display(f"{CLOSING}\n\nThe cart total is right now."))
    messages = agent_messages(story)
    story.expect_rows([message.parent_id for message in messages if message.parent_id is not None] == [1], messages[0].parent_id == 1)


def test_the_closing_text_of_a_turn_that_a_message_started_replies_to_it_and_not_to_one_that_came_during_the_turn(new_story):
    story = story_after_fixture(new_story, MessageToStoppedAgent)
    person_message(story, "And the tax too?")
    story.hook("s-1", HookSamples.message_display(CLOSING))
    closing = agent_messages(story)[0]
    story.expect_rows(closing.text == CLOSING, closing.parent_id == 1)
