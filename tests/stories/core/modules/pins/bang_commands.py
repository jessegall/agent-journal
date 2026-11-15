from core.modules.pins.nudges.bang_button_request_message import BangButtonRequestMessage
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.fixtures import UserJoined
BUTTON_REQUEST = BangButtonRequestMessage.declared().nudge().text


def button_lines(hook_answer) -> list[str]:
    return [line for line in hook_answer.lines if BUTTON_REQUEST in line]


def test_a_command_with_a_pinned_button_is_not_asked_for_again(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('pin make "Build the viewer" --link "! npm run build" --label "Run" --environment main', "pin 1 made: Build the viewer -> ! npm run build", actor=story.agent)
    expect_absent_button_lines(story.hook("s-1", HookSamples.message_display("Run `! npm run build`")))


def test_a_command_whose_button_was_closed_is_asked_for_again(new_story):
    story = new_story(fixture=UserJoined)
    story.run('pin make "Build the viewer" --link "! npm run build" --label "Run" --environment main', actor=story.agent)
    story.expect_success("pin close 1", actor=story.user)
    story.hook("s-1", HookSamples.message_display("Run `! npm run build`"))
    story.expect_text(f"agent-line list --agent {story.agent.id} --state waiting", BUTTON_REQUEST, actor=story.user)


def test_a_pin_may_hold_a_command_for_a_button_and_lists_it(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('pin make "Build the viewer" --link "! npm run build" --label "Run" --environment main', "pin 1 made: Build the viewer -> ! npm run build", actor=story.agent)
    story.expect_text("pin list --environment main", "! npm run build", actor=story.user)


def test_a_bare_bang_is_no_command(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('pin make "Nothing" --link "!" --environment main', "or to a command that starts with !", actor=story.agent)


def expect_absent_button_lines(hook_answer) -> None:
    assert not button_lines(hook_answer)
