from core.testing.hook_samples import HookSamples
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_answers, expect_lines_with

BUTTON_REQUEST = "a button runs your ! command"


def button_lines(hook_answer) -> list[str]:
    return [line for line in hook_answer.lines if BUTTON_REQUEST in line]


def test_a_bang_command_the_agent_asks_the_user_to_run_is_answered_with_a_request_to_pin_it_as_a_button(new_story):
    story = new_story(fixture=UserJoined)
    lines = button_lines(story.hook("s-1", HookSamples.message_display("Run this yourself: `! npm run build`")))
    expect_answers(lines, 1)
    expect_lines_with(lines, '--link "! <command>"')
    expect_lines_with(lines, '--label "Run"')


def test_a_bang_command_on_a_line_of_its_own_is_found(new_story):
    story = new_story(fixture=UserJoined)
    expect_button_lines(story.hook("s-1", HookSamples.message_display("Please type:\n! git push\nthen tell me.")))


def test_words_with_an_exclamation_mark_are_not_taken_for_a_command(new_story):
    story = new_story(fixture=UserJoined)
    expect_absent_button_lines(story.hook("s-1", HookSamples.message_display("Done! The build passed!\nGreat!npm is fine")))


def test_a_command_with_a_pinned_button_is_not_asked_for_again(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('pin make "Build the viewer" --link "! npm run build" --label "Run" --environment main', "pin 1 made: Build the viewer -> ! npm run build", actor=story.agent)
    expect_absent_button_lines(story.hook("s-1", HookSamples.message_display("Run `! npm run build`")))


def test_a_command_whose_button_was_closed_is_asked_for_again(new_story):
    story = new_story(fixture=UserJoined)
    story.run('pin make "Build the viewer" --link "! npm run build" --label "Run" --environment main', actor=story.agent)
    story.expect_success("pin close 1", actor=story.user)
    expect_button_lines(story.hook("s-1", HookSamples.message_display("Run `! npm run build`")))


def test_each_command_is_asked_for_on_its_own(new_story):
    story = new_story(fixture=UserJoined)
    expect_button_lines(story.hook("s-1", HookSamples.message_display("Run `! npm run build`")))
    expect_button_lines(story.hook("s-1", HookSamples.message_display("Run `! npm test`")))


def test_a_pin_may_hold_a_command_for_a_button_and_lists_it(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('pin make "Build the viewer" --link "! npm run build" --label "Run" --environment main', "pin 1 made: Build the viewer -> ! npm run build", actor=story.agent)
    story.expect_text("pin list --environment main", "! npm run build", actor=story.user)


def test_a_bare_bang_is_no_command(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('pin make "Nothing" --link "!" --environment main', "or to a command that starts with !", actor=story.agent)


def expect_button_lines(hook_answer) -> None:
    assert button_lines(hook_answer)


def expect_absent_button_lines(hook_answer) -> None:
    assert not button_lines(hook_answer)
