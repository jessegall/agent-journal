from datetime import timedelta

from engine.database.database import Database
from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_value_with


def test_a_long_run_hook_does_not_scan_old_parts(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    old = start_process(story, " && ".join(f"echo old-{number}" for number in range(500)))
    end_run(story, old, "done\n")
    start_process(story, "make build", category=CommandCategory.BUILD)
    story.advance(timedelta(seconds=6))
    connection = story.container.get(Database).connection
    steps = []
    statements = []
    connection.set_progress_handler(lambda: steps.append(1) or 0, 100)
    connection.set_trace_callback(statements.append)
    try:
        story.hook("s-1", HookSamples.stop())
    finally:
        connection.set_progress_handler(None, 0)
        connection.set_trace_callback(None)
    expect_steps_less(steps, 100)
    query = next(statement for statement in statements if "process_parts" in statement and "started_at" in statement and statement.startswith("SELECT"))
    plan = " ".join(row[3] for row in connection.execute(f"EXPLAIN QUERY PLAN {query}"))
    expect_value_with(plan, "SEARCH process_parts USING INDEX sqlite_autoindex_process_parts_1")


def expect_steps_less(steps, expected) -> None:
    actual = len(steps)
    assert actual < expected, actual
