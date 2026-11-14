from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import BuilderStarted, StartedTaskBuilder
from core.modules.tasks.support.task_nudges import BLOCKED_TASKS
from engine.testing.expectations.expected_nudge import expected_nudge


def test_a_builder_with_only_blocked_tasks_is_refused_at_its_first_stop_and_not_its_second(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run(lines.NEW_TASK)
    story.run("task block 1 --reason 'waits for the price list'")
    story.expect_hook_refusal("s-1", HookSamples.stop(), expected_nudge(BLOCKED_TASKS))
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_a_stop_passes_while_the_agent_waits_on_a_run_with_a_monitor_and_is_refused_once_the_run_ends(new_story):
    story = install_runner(new_story(fixture=StartedTaskBuilder))
    process = start_process(story, "make build")
    story.expect_hook_refusal("s-1", HookSamples.stop(), "is in hand: continue")
    story.hook("s-1", HookSamples.sample("pre_tool_use", {"name": "Monitor", "category": "monitor", "input": {"command": "wait"}}))
    story.expect_hook_allowed("s-1", HookSamples.stop())
    end_run(story, process, "done\n")
    story.expect_hook_refusal("s-1", HookSamples.stop(), "is in hand: continue")
