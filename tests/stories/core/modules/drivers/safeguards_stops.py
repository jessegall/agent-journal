from datetime import timedelta

from core.modules.drivers.commands.wake_safeguards_stopped_agent.wake_safeguards_stopped_agent_handler import WAKE_SOURCE
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.engine.driver.support.samples import SAMPLES
from tests.stories.core.modules.messages.reply_teaching import ReplySession

SAFEGUARDS_ERROR = "API Error: this request was stopped by the model safeguards (reasoning_extraction), request id req_011CabcDEF123"
DIFFERENT_ERROR = "API Error: the service is overloaded, try again"


def wake_lines(story) -> list[AgentLine]:
    return list(story.story_rows(AgentLine, source=WAKE_SOURCE))


def chat_notes(story) -> list[Message]:
    return list(story.story_rows(Message, type=MessageType.JOURNAL))


class AgentRunning(StoryFixture):
    """The main agent of the reply stories, a second after its session began."""

    parent = ReplySession

    def steps(self, story):
        story.advance(timedelta(seconds=1))


class SafeguardsStopped(StoryFixture):
    """The main agent whose first turn was ended by a safeguards error."""

    parent = AgentRunning

    def steps(self, story):
        story.hook("s-1", HookSamples.stop_failure(SAFEGUARDS_ERROR))


def test_a_turn_ended_by_a_safeguards_error_wakes_its_agent_once_and_tells_nobody(new_story):
    story = new_story(SAMPLES, fixture=SafeguardsStopped)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "An API safeguards error ended your last turn")
    story.expect_rows(len(wake_lines(story)) == 1, chat_notes(story) == [])


def test_a_second_turn_ended_the_same_way_tells_the_chat_with_the_details_and_request_id_and_wakes_nobody(new_story):
    story = new_story(SAMPLES, fixture=SafeguardsStopped)
    story.advance(timedelta(seconds=5))
    story.hook("s-1", HookSamples.stop_failure(SAFEGUARDS_ERROR))
    notes = chat_notes(story)
    story.expect_rows(len(wake_lines(story)) == 1, len(notes) == 1)
    story.expect_rows("reasoning_extraction" in notes[0].text, "req_011CabcDEF123" in notes[0].text, detail=notes[0].text)
    story.advance(timedelta(seconds=5))
    story.hook("s-1", HookSamples.stop_failure(SAFEGUARDS_ERROR))
    story.expect_rows(len(wake_lines(story)) == 1)


def test_a_turn_that_ended_on_its_own_between_two_stops_wakes_the_agent_again(new_story):
    story = new_story(SAMPLES, fixture=SafeguardsStopped)
    story.advance(timedelta(seconds=5))
    story.hook("s-1", HookSamples.stop())
    story.advance(timedelta(seconds=5))
    story.hook("s-1", HookSamples.stop_failure(SAFEGUARDS_ERROR))
    story.expect_rows(len(wake_lines(story)) == 2, chat_notes(story) == [])


def test_an_api_error_that_is_not_a_safeguards_stop_wakes_and_tells_nobody(new_story):
    story = new_story(SAMPLES, fixture=AgentRunning)
    story.hook("s-1", HookSamples.stop_failure(DIFFERENT_ERROR))
    story.expect_rows(wake_lines(story) == [], chat_notes(story) == [])
