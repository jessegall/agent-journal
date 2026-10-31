from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.modules.processes.support.process_samples import runner_line, user_waits, with_parse_error
from tests.stories.core.support.coding_fixtures import BuilderStarted, SubagentStarted

LISTING = HookSamples.shell("ls build", ShellPart("ls", CommandCategory.SEARCH, ["build"]))
JOURNAL = HookSamples.shell("journal task show 1", ShellPart("journal", CommandCategory.JOURNAL, ["task", "show", "1"], subcommand="task"))
TESTS = HookSamples.shell("pytest -q", ShellPart("pytest", CommandCategory.TEST_RUN, ["-q"], effects=[CommandEffect.READS_FILES]))
BUILD = HookSamples.shell("make build", ShellPart("make", CommandCategory.BUILD, ["build"]))


def test_a_shell_hook_of_the_builder_is_answered_with_the_runner_line_and_a_process_row(new_story):
    story = new_story(fixture=BuilderStarted)
    reply = story.hook("s-1", LISTING)
    assert dict(reply.updated_input) == {"command": runner_line(1, "ls build")}
    story.expect_success("process show 1", "line: ls build", "state: running", "limit_seconds: 30", f"agent_id: {story.agent.id}")
    story.expect_text(f"hook-call show {reply.hook_call_id}", "processes.runner-rewrite: rewritten")


def test_a_journal_only_line_has_limit_0(new_story):
    story = new_story(fixture=BuilderStarted)
    assert dict(story.hook("s-1", JOURNAL).updated_input) == {"command": runner_line(1, "journal task show 1", limit=0)}


def test_a_test_run_and_a_build_go_to_the_background_at_once(new_story):
    story = new_story(fixture=BuilderStarted)
    assert dict(story.hook("s-1", TESTS).updated_input) == {"command": runner_line(1, "pytest -q", background=True)}
    assert dict(story.hook("s-1", BUILD).updated_input) == {"command": runner_line(2, "make build", background=True)}


def test_a_command_whose_last_run_went_past_the_limit_goes_to_the_background_at_once(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", LISTING)
    story.run("process background 1", actor=story.agent)
    assert dict(story.hook("s-1", LISTING).updated_input) == {"command": runner_line(2, "ls build", background=True)}


def test_the_limit_drops_to_10_seconds_while_a_message_waits_for_the_user(new_story):
    story = new_story(fixture=BuilderStarted)
    user_waits(story)
    assert dict(story.hook("s-1", LISTING).updated_input) == {"command": runner_line(1, "ls build", limit=10)}


def test_a_subagent_s_line_is_not_rewritten_and_makes_no_process(new_story):
    story = new_story(fixture=SubagentStarted)
    story.hook("s-1", LISTING)
    assert dict(story.hook("s-1", LISTING.with_fields(subagent="sub-1")).updated_input) == {}
    story.expect_refusal("process show 2", "no process 2")


def test_a_line_with_a_parse_error_is_let_through(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", LISTING)
    assert dict(story.hook("s-1", with_parse_error(LISTING)).updated_input) == {}
    story.expect_refusal("process show 2", "no process 2")


def test_a_second_rule_that_rewrites_the_hook_is_refused_and_no_process_is_kept(new_story):
    story = new_story(SAMPLES, fixture=BuilderStarted)
    story.run("setting make samples.rewrite-coding true")
    story.expect_hook_refusal("s-1", LISTING, "processes.runner-rewrite")
    story.expect_refusal("process show 1", "no process 1")


def test_a_background_bash_call_of_claude_runs_in_the_foreground_through_the_runner(new_story):
    story = new_story(fixture=BuilderStarted)
    background = LISTING.with_fields(raw={"tool_input": {"command": "ls build", "run_in_background": True, "description": "list"}})
    assert dict(story.hook("s-1", background).updated_input) == {"command": runner_line(1, "ls build"), "description": "list"}
