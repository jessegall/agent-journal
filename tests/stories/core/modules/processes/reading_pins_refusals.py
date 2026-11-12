from datetime import timedelta

from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.hang_watch import HANG_SECONDS, LOOK_SECONDS, ActiveBuild, ActiveTestRun, busy_for, started_tree, watch_tick
from tests.stories.core.modules.processes.support.process_samples import install_runner, monitor
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders
from tests.stories.core.support.coding_fixtures import BuilderStarted

HELD = "output 1 printed nothing for 301 seconds"
HUNG = "so it was stopped: its output is kept"
PEEK_OUTPUT = HookSamples.shell("journal output peek 1", ShellPart("journal", CommandCategory.JOURNAL, ["output", "peek", "1"], subcommand="output"))
PAGE_OUTPUT = HookSamples.shell("journal output page 1", ShellPart("journal", CommandCategory.JOURNAL, ["output", "page", "1"], subcommand="output"))
RUN_STATUS = HookSamples.shell("journal output status 7", ShellPart("journal", CommandCategory.JOURNAL, ["output", "status", "7"], subcommand="output"))
MONITOR_IN_SHELL = HookSamples.shell("journal output monitor 7", ShellPart("journal", CommandCategory.JOURNAL, ["output", "monitor", "7"], subcommand="output"))


def test_a_run_idle_and_silent_for_the_hang_time_is_stopped_and_its_agent_told_its_output_is_kept(new_story):
    story = new_story(fixture=ActiveBuild)
    started_tree(story, 12.0)
    story.advance(timedelta(seconds=HANG_SECONDS + 5))
    watch_tick(story)
    story.expect_text("process show 1", "state: stopped", actor=story.agent)
    story.expect_text(f"agent-line list --agent {story.agent.id}", HUNG, actor=story.agent)


def test_a_busy_silent_test_run_is_stopped_after_three_asks_to_look_go_unanswered(new_story):
    story = new_story(fixture=ActiveTestRun)
    tree = started_tree(story, 12.0)
    busy_for(story, tree, LOOK_SECONDS + 5)
    for _ in range(2):
        busy_for(story, tree, HANG_SECONDS + 1)
    story.expect_text("process show 1", "state: background", actor=story.agent)
    busy_for(story, tree, HANG_SECONDS + 1)
    story.expect_text("process show 1", "state: stopped", actor=story.agent)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "printed nothing for", "but uses processor time: read it, and stop it if it hangs", HUNG, actor=story.agent)


def test_a_worker_asking_for_a_runs_status_is_told_the_run_is_watched_for_it(new_story):
    story = new_story(fixture=ForcedReaders)
    story.expect_hook_allowed("s-reader", RUN_STATUS, "output 7 is watched for you: go on working or stop")


def test_the_output_monitor_command_is_refused_in_the_shell_and_let_through_in_the_monitor_tool(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_hook_refusal("s-1", MONITOR_IN_SHELL, "the output wait runs only in a Monitor")
    story.expect_hook_allowed("s-1", monitor("journal output monitor 7"))
