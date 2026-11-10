from datetime import timedelta

from engine.database.database import Database
from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from core.modules.docking.queries.dock_item_query import DockItemQuery
from tests.stories.core.modules.processes.support.process_samples import install_runner, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_a_hook_reads_running_outputs_and_parts_together(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    for number in range(12):
        process = start_process(story, f"make build-{number}", category=CommandCategory.BUILD)
        story.expect_success(f"dock add processes.output process {process.id} --environment main", actor=story.agent)
        if number < 6:
            item = story.container.get(DockItemQuery).row_items("process", process.id).first()
            story.expect_success(f"dock remove {item.id}", actor=story.agent)
    story.advance(timedelta(seconds=6))
    connection = story.container.get(Database).connection
    statements = []
    connection.set_trace_callback(statements.append)
    try:
        story.hook("s-1", HookSamples.stop())
    finally:
        connection.set_trace_callback(None)
    for table in ("outputs", "process_parts"):
        reads = [statement for statement in statements if statement.startswith(f"SELECT * FROM {table} WHERE") and "process_id" in statement]
        story.expect_rows(len(reads) == 1)
