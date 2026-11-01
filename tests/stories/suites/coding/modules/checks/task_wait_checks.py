from datetime import timedelta

from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from suites.coding.modules.checks.support.due_check_runs import DueCheckRuns
from tests.stories.core.support.coding_fixtures import BuilderStarted

LOOK = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, [])).with_fields(event="post_tool_use")


def waiting_story(new_story, command):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Cart" --environment main')
    story.expect_success(f"task block 1 --until '{command}' --every 2", "state: blocked")
    return story


def run_due(story):
    story.container.get(DueCheckRuns).run()


def test_a_task_blocked_until_a_command_passes_opens_when_it_does_and_its_check_goes(new_story):
    story = waiting_story(new_story, "true")
    run_due(story)
    story.expect_success("task show 1", "state: open")
    story.expect_absent("check list", "Task 1 waits")


def test_a_failing_command_keeps_the_task_blocked_without_a_failed_check_line(new_story):
    story = waiting_story(new_story, "false")
    run_due(story)
    story.expect_success("task show 1", "state: blocked")
    story.expect_absent_hook_line("s-1", LOOK, "fails")


def test_a_command_that_cannot_run_is_named_to_the_agent(new_story):
    story = waiting_story(new_story, "no-such-command-here")
    run_due(story)
    assert any("task 1 waits on a command that cannot run" in line for line in story.hook("s-1", LOOK).lines)


def test_unblocking_by_hand_removes_the_check(new_story):
    story = waiting_story(new_story, "false")
    story.run("task unblock 1")
    story.expect_absent("check list", "Task 1 waits")
