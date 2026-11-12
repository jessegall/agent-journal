from tests.stories.core.modules.drivers.support.confirmed_skips import confirmed_skip
from datetime import timedelta

from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value

FIRST = "Merges are blocked until you accept approval card 15 or switch Auto on"
REWORDED = "Merges stay blocked until you accept approval card 15 or turn Auto on"
DIFFERENT = "Worker 697 is building the browser login and installs it tonight"
SINGLE_SUBJECT = "The skills came back attached after the compaction, the overview printed old reports, and the hold stopped a read of the fixtures"
DUPLICATE_SUBJECT = "The fixtures read and the hold came first, then old reports from the overview, and the compaction attached the skills last"
FILLERS = ("The login cookie now carries a name of its own per journal", "Plan 1099 is merged with its declared inspectors and docked cards",
           "Worker 701 added the update path for a project installed from source", "The sandbox switch lets a user run one worker without it",
           "Approval cards waiting for a user keep no pin button any more")


class FirstMessageDelivered(StoryFixture):
    """The agent has sent its first message, which later ones are compared with."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        delivered(story, FIRST)


def delivered(story, text: str) -> None:
    story.advance(timedelta(seconds=1))
    story.expect_success(f'message send "{text}"', "type: agent", actor=story.agent)


def test_a_reworded_repeat_of_one_of_the_last_five_messages_is_held(new_story):
    story = new_story(fixture=FirstMessageDelivered, environment="main")
    story.expect_refusal(f'message send "{REWORDED}"', "refused by messages.repeated-message: this is much the same as your message 1",
                         actor=story.agent)
    confirmed_skip(story, "messages.repeated-message", story.agent, "the card number changed")
    story.advance(timedelta(seconds=1))
    story.expect_success(f'message send "{REWORDED}" --confirm --skip-reason "the card number changed"', "type: agent", actor=story.agent)


def test_a_different_message_and_a_short_one_pass(new_story):
    story = new_story(fixture=FirstMessageDelivered, environment="main")
    delivered(story, DIFFERENT)
    delivered(story, "Done, installed.")
    delivered(story, "Done, installed now.")


def test_a_message_on_the_same_subject_with_its_points_elsewhere_in_the_text_passes(new_story):
    story = new_story(fixture=UserJoined, environment="main")
    delivered(story, SINGLE_SUBJECT)
    delivered(story, DUPLICATE_SUBJECT)


def test_closing_words_much_like_an_earlier_turns_message_are_held_and_the_agent_is_told(new_story):
    story = new_story(fixture=UserBuilder, environment="main")
    story.run('message send "Is the merge done?"', actor=story.user)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.run(f'message reply 1 "{FIRST}"', actor=story.agent)
    story.run('message send "And the cart?"', actor=story.user)
    story.hook("s-1", HookSamples.prompt("go on"))
    shown = story.hook("s-1", HookSamples.message_display(REWORDED))
    expect_value("your closing words say much the same as message 3, so they were not shown" in shown.lines, True)
    expect_value(REWORDED not in story.run("message list", actor=story.user).output_text, True)
