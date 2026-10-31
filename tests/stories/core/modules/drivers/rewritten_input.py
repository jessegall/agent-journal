from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.base.driver.support.fixtures import LeadStarted
from tests.stories.core.base.driver.support.samples import SAMPLES

LISTING = HookSamples.shell("ls build", ShellPart("ls", CommandCategory.SEARCH, ["build"], effects=[CommandEffect.READS_FILES]))


def test_a_rule_that_rewrites_a_shell_line_gives_the_hook_reply_the_new_input_and_the_call_names_the_rule(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.run("setting make samples.rewrite true")
    reply = story.hook("s-1", LISTING)
    assert reply.refusal == "" and dict(reply.updated_input) == {"command": "sample-run -- ls build"}
    story.expect_text(f"hook-call show {reply.hook_call_id}", "samples.shell-rewrite: rewritten")


def test_with_no_rewriting_rule_the_hook_reply_has_no_new_input(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    assert dict(story.hook("s-1", LISTING).updated_input) == {}


def test_two_rules_that_rewrite_one_shell_line_are_refused_naming_both(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.run("setting make samples.rewrite true")
    story.run("setting make samples.rewrite-twice true")
    story.expect_hook_refusal("s-1", LISTING, "samples.shell-rewrite")


def test_an_input_built_from_the_result_of_a_rules_command_carries_what_the_command_made(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.run("setting make samples.rewrite-after true")
    reply = story.hook("s-1", LISTING)
    assert dict(reply.updated_input) == {"command": "sample-run --process 7 -- ls build"}


def test_a_hook_sent_twice_is_answered_with_the_same_new_input(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.run("setting make samples.rewrite-after true")
    sent = LISTING.with_fields(firing="sent-twice")
    first = story.hook("s-1", sent)
    assert dict(story.hook("s-1", sent).updated_input) == dict(first.updated_input) == {"command": "sample-run --process 7 -- ls build"}
