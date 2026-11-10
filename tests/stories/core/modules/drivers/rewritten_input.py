from engine.driver.command_category import CommandCategory
from engine.driver.command_effect import CommandEffect
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.engine.driver.support.fixtures import LeadLocked, LeadStarted
from tests.stories.engine.driver.support.samples import REMOVAL, SAMPLES
from tests.stories.support.story_checks import expect_refusal_reply, expect_updated_input_hook, expect_updated_input_reply

LISTING = HookSamples.shell("ls build", ShellPart("ls", CommandCategory.SEARCH, ["build"], effects=[CommandEffect.READS_FILES]))


def test_a_hook_sent_twice_is_answered_with_the_same_new_input(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.run("setting make samples.rewrite-after true")
    repeated_listing = LISTING.with_fields(firing="sent-twice")
    first = story.hook("s-1", repeated_listing)
    expect_updated_input_hook_2(story, "s-1", repeated_listing, first, "command", "sample-run --process 7 -- ls build")


def test_a_refused_shell_line_of_a_program_that_prints_refusals_runs_as_a_line_that_prints_the_reason(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    reply = story.hook("s-1", REMOVAL)
    expect_refusal_reply(reply, "the lead removes no folder")
    expect_updated_input_reply(reply, {"command": "printf '%s\\n' 'the lead removes no folder'"})
    story.expect_text(f"hook-call show {reply.hook_call_id}", "samples.removal-limit: refused")


def expect_updated_input_hook_2(story, text, repeated_listing, first, text_2, text_3) -> None:
    actual = dict(story.hook(text, repeated_listing).updated_input) == dict(first.updated_input) == {text_2: text_3}
    assert actual, actual
