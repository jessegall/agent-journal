import pytest
from datetime import timedelta

from engine.database.database import Database
from engine.registry.registry import Registry
from core.modules.drivers.support.hook_cost_tool import HOOK_LIMIT_POINTS
from engine.enums.command_category import CommandCategory
from engine.enums.tool_type import ToolType
from core.modules.processes.support.output_folder import OutputFolder
from suites.coding.modules.checks.support.due_check_runs import DueCheckRuns
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.drivers.hook_durations import UserBuilder
from tests.stories.core.modules.processes.support.process_samples import moved_run
from tests.stories.support.story_checks import expect_absent_value, expect_total_cost_less, expect_greater

ROW_COUNT = 40
READS_MEASURED = 60
SAMPLES = {
    "session_start": HookSamples.session_start(),
    "prompt": HookSamples.prompt("Fix the cart"),
    "edit": HookSamples.edit("cart.py"),
    "shell": HookSamples.shell("ls -la", ShellPart("ls", CommandCategory.READ, ["-la"])),
    "stop": HookSamples.stop(),
    "tick": HookSamples.tick(),
    "post_tool_use": HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, [])).with_fields(event="post_tool_use"),
}


def filled(story) -> None:
    for number in range(ROW_COUNT):
        story.run(f'task make "Task {number}" --brief "A job to do" --environment main', actor=story.user)
        story.run(f'message send "Message {number}" --environment main', actor=story.user)
        story.expect_success(f'memory make "Fact {number}" --environment main', actor=story.user)


@pytest.mark.parametrize("elapsed_seconds", [0, 35])
def test_post_tool_use_stays_under_budget_with_checks_background_runs_and_held_tasks(busy_hook_points, elapsed_seconds):
    story, database = busy_hook_points
    story.advance(timedelta(seconds=elapsed_seconds))
    start = database.repeated_work.points()
    story.hook("s-1", SAMPLES["post_tool_use"])
    cost = database.repeated_work.points().minus(start)
    expect_total_cost_less(cost, HOOK_LIMIT_POINTS)


def test_every_kind_of_hook_costs_the_database_under_the_points_a_hook_may_cost_on_a_filled_journal(filled_hook_points):
    story, database, finished = filled_hook_points
    for name, sample in SAMPLES.items():
        start = database.repeated_work.points()
        story.hook("s-1", sample)
        cost = database.repeated_work.points().minus(start)
        if cost.total >= HOOK_LIMIT_POINTS:
            finished[name] = f"{cost.total} points ({cost.line()}); " + "; ".join(f"{rows} rows: {sql[:90]}" for sql, rows in cost.statements.most_common(3))
    expect_absent_value(finished)


def test_every_read_a_window_asks_of_an_endpoint_costs_under_the_same_points_on_a_filled_journal(filled_hook_points):
    story, database, finished = filled_hook_points
    story.use_fixture_environment(None)
    measured = 0
    for read in sorted({read for window in story.container.get(Registry).windows for read in window.reads}):
        for line in (read, f"{read} 1", f"{read} --agent {story.agent.id}"):
            start = database.repeated_work.points()
            outcome = story.run(line, actor=story.user)
            cost = database.repeated_work.points().minus(start)
            if outcome.code != 0:
                continue
            measured += 1
            if cost.total >= HOOK_LIMIT_POINTS:
                finished[line] = f"{cost.total} points ({cost.line()}); " + "; ".join(f"{rows} rows: {sql[:90]}" for sql, rows in cost.statements.most_common(3))
            break
    expect_greater(measured, READS_MEASURED)
    expect_absent_value(finished)


@pytest.fixture
def filled_hook_points(new_story):
    story = new_story(fixture=UserBuilder)
    filled(story)
    story.hook("s-1", HookSamples.prompt("Carry on"))
    database = story.container.get(Database)
    finished = {}
    return story, database, finished


@pytest.fixture
def busy_hook_points(filled_hook_points):
    story, database, _ = filled_hook_points
    for number in range(22):
        story.expect_success(f'question ask "Choose database {number}" --context "A story asks this so its card and answer can be checked." --options sqlite postgres --environment main', actor=story.agent)
        story.expect_success(f"question answer {number + 1} --answer sqlite", actor=story.user)
    for number in range(6):
        story.expect_success(f'sequence make "Sequence {number}" --steps "Read the task | Do the task"', actor=story.user)
    for task_id in range(1, 9):
        story.expect_success(f"task start {task_id}", actor=story.agent)
        story.expect_success(f"task overview {task_id}", actor=story.agent)
    for task_id in range(9, 17):
        story.expect_success(f"task block {task_id} --until 'false' --every 2", actor=story.user)
        story.expect_success(f'check make "Check {task_id}" --command "true" --every 0', actor=story.user)
    for task_id in range(17, 25):
        story.expect_success(f'task block {task_id} --reason "Waiting on a decision"', actor=story.user)
    story.container.get(DueCheckRuns).run()
    for number in range(10):
        process = moved_run(story, f"deploy build-{number}")
        story.container.get(OutputFolder).write_output(process.id, 1, "building\n")
        monitor = HookSamples.tool_use("Monitor", ToolType.MONITOR, [], None).with_raw({"tool_input": {"command": f"journal output monitor {process.id}"}})
        story.hook("s-1", monitor)
    story.hook("s-1", SAMPLES["post_tool_use"])
    return story, database
