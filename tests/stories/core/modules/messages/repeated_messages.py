from tests.stories.core.modules.drivers.support.confirmed_skips import confirmed_skip
from datetime import timedelta

from core.testing.hook_samples import HookSamples
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value

FIRST = "Merges are blocked until you accept approval card 15 or switch Auto on"
REWORDED = "Merges stay blocked until you accept approval card 15 or turn Auto on"
DIFFERENT = "Worker 697 is building the browser login and installs it tonight"
ONE_SUBJECT = "The skills came back attached after the compaction, the overview printed old reports, and the hold stopped a read of the fixtures"
SAME_SUBJECT_ELSEWHERE = "The fixtures read and the hold came first, then old reports from the overview, and the compaction attached the skills last"
FILLERS = ("The login cookie now carries a name of its own per journal", "Plan 1099 is merged with its declared inspectors and docked cards",
           "Worker 701 added the update path for a project installed from source", "The sandbox switch lets a person run one worker without it",
           "Approval cards waiting for a person keep no pin button any more")


class FirstMessageSent(StoryFixture):
    """The agent has sent its first message, which later ones are compared with."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        sent(story, FIRST)


def sent(story, text: str) -> None:
    story.advance(timedelta(seconds=1))
    story.expect_success(f'message send "{text}"', "type: agent", actor=story.agent)


def test_a_reworded_repeat_of_one_of_the_last_five_messages_is_held(new_story):
    story = new_story(fixture=FirstMessageSent, environment="main")
    story.expect_refusal(f'message send "{REWORDED}"', "refused by messages.repeated-message: this says much the same as your message 1",
                         actor=story.agent)
    confirmed_skip(story, "messages.repeated-message", story.agent, "the card number changed")
    story.advance(timedelta(seconds=1))
    story.expect_success(f'message send "{REWORDED}" --confirm --skip-reason "the card number changed"', "type: agent", actor=story.agent)


def test_a_different_message_and_a_short_one_pass(new_story):
    story = new_story(fixture=FirstMessageSent, environment="main")
    sent(story, DIFFERENT)
    sent(story, "Done, installed.")
    sent(story, "Done, installed now.")


def test_a_message_on_the_same_subject_with_its_points_elsewhere_in_the_text_passes(new_story):
    story = new_story(fixture=UserJoined, environment="main")
    sent(story, ONE_SUBJECT)
    sent(story, SAME_SUBJECT_ELSEWHERE)


def test_only_the_last_five_messages_are_compared(new_story):
    story = new_story(fixture=FirstMessageSent, environment="main")
    for filler in FILLERS:
        sent(story, filler)
    sent(story, REWORDED)


def test_closing_words_much_like_an_earlier_turns_message_are_held_and_the_agent_is_told(new_story):
    story = new_story(fixture=BuilderWithUser, environment="main")
    story.run('message send "Is the merge done?"', actor=story.user)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.run(f'message reply 1 "{FIRST}"', actor=story.agent)
    story.run('message send "And the cart?"', actor=story.user)
    story.hook("s-1", HookSamples.prompt("go on"))
    shown = story.hook("s-1", HookSamples.message_display(REWORDED))
    expect_value("your closing words say much the same as message 3, so they were not shown" in shown.lines, True)
    expect_value(REWORDED not in story.run("message list", actor=story.user).output_text, True)
