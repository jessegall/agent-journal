from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.base.driver.support.fixtures import LeadLocked, LeadStarted
from tests.stories.core.base.driver.support.samples import REMOVAL, SAMPLES

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
    repeated_listing = LISTING.with_fields(firing="sent-twice")
    first = story.hook("s-1", repeated_listing)
    assert dict(story.hook("s-1", repeated_listing).updated_input) == dict(first.updated_input) == {"command": "sample-run --process 7 -- ls build"}


def test_a_shell_line_the_agent_would_run_in_its_own_background_is_asked_for_without_the_flag(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.run("setting make samples.foreground true")
    background = LISTING.with_fields(raw={"tool_input": {"command": "ls build", "run_in_background": True, "description": "list"}})
    assert dict(story.hook("s-1", background).updated_input) == {"command": "ls build", "description": "list"}
    foreground = LISTING.with_fields(raw={"tool_input": {"command": "ls build", "run_in_background": False}})
    assert dict(story.hook("s-1", foreground).updated_input) == {}


def test_a_refused_shell_line_of_a_program_that_prints_refusals_runs_as_a_line_that_prints_the_reason(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    reply = story.hook("s-1", REMOVAL)
    assert reply.refusal == "the lead removes no folder" and dict(reply.updated_input) == {"command": "printf '%s\\n' 'the lead removes no folder'"}
    story.expect_text(f"hook-call show {reply.hook_call_id}", "samples.removal-limit: refused")


def test_a_refused_edit_is_refused_with_no_new_input(new_story):
    story = new_story(SAMPLES, fixture=LeadLocked)
    reply = story.hook("s-1", HookSamples.edit("src/cart.py"))
    assert reply.refusal != "" and dict(reply.updated_input) == {}
