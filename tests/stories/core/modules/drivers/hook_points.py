import pytest

from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.modules.drivers.support.hook_cost_tool import HOOK_LIMIT_POINTS
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.drivers.hook_durations import BuilderWithUser
from tests.stories.core.modules.processes.support.process_samples import moved_run

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
        story.expect_success(f'memory make "Fact {number}" --type fact --project', actor=story.user)


def test_post_tool_use_stays_under_budget_with_checks_background_runs_and_held_tasks(busy_hook_points):
    story, database = busy_hook_points
    start = database.tally.points()
    story.hook("s-1", SAMPLES["post_tool_use"])
    cost = database.tally.points().minus(start)
    assert cost.total < HOOK_LIMIT_POINTS, f"{cost.total} points ({cost.line()}): {cost.statements.most_common(10)}"


def test_every_kind_of_hook_costs_the_database_under_the_points_a_hook_may_cost_on_a_filled_journal(filled_hook_points):
    story, database, over = filled_hook_points
    for name, sample in SAMPLES.items():
        start = database.tally.points()
        story.hook("s-1", sample)
        cost = database.tally.points().minus(start)
        if cost.total >= HOOK_LIMIT_POINTS:
            over[name] = f"{cost.total} points ({cost.line()}); " + "; ".join(f"{rows} rows: {sql[:90]}" for sql, rows in cost.statements.most_common(3))
    assert not over, "\n".join(f"{name}: {line}" for name, line in over.items())


def test_every_read_a_window_asks_of_an_endpoint_costs_under_the_same_points_on_a_filled_journal(filled_hook_points):
    story, database, over = filled_hook_points
    measured = 0
    for read in sorted({read for window in story.container.get(Registry).windows for read in window.reads}):
        for line in (read, f"{read} 1", f"{read} --agent {story.agent.id}"):
            start = database.tally.points()
            outcome = story.run(line, actor=story.user)
            cost = database.tally.points().minus(start)
            if outcome.code != 0:
                continue
            measured += 1
            if cost.total >= HOOK_LIMIT_POINTS:
                over[line] = f"{cost.total} points ({cost.line()}); " + "; ".join(f"{rows} rows: {sql[:90]}" for sql, rows in cost.statements.most_common(3))
            break
    assert measured > READS_MEASURED, f"only {measured} reads ran"
    assert not over, "\n".join(f"{line}: {text}" for line, text in over.items())


@pytest.fixture
def filled_hook_points(new_story):
    story = new_story(fixture=BuilderWithUser)
    filled(story)
    story.hook("s-1", HookSamples.prompt("Carry on"))
    database = story.container.get(Database)
    over = {}
    return story, database, over


@pytest.fixture
def busy_hook_points(filled_hook_points):
    story, database, _ = filled_hook_points
    for task_id in range(1, 9):
        story.expect_success(f"task start {task_id}", actor=story.agent)
        story.expect_success(f"task brief {task_id}", actor=story.agent)
    for task_id in range(9, 17):
        story.expect_success(f"task block {task_id} --until 'false' --every 2", actor=story.user)
        story.expect_success(f'check make "Check {task_id}" --command "true" --every 0', actor=story.user)
    for task_id in range(17, 25):
        story.expect_success(f'task block {task_id} --reason "Waiting on a decision"', actor=story.user)
    for number in range(10):
        moved_run(story, f"make build-{number}")
    return story, database
