import json
from pathlib import Path

from engine.database.database import Database
from engine.database.statement import Statement
from tests.stories.core.modules.tasks.support.assignment_migration_fixtures import DELEGATED_TASKS, TasksBeforeColumnRemoval, worker
from tests.stories.support.story_checks import expect_value_4

SOURCE_FOLDER = Path(__file__).resolve().parents[4] / "src"
TASK_MIGRATIONS = SOURCE_FOLDER / "core" / "modules" / "tasks" / "migrations"
HISTORY_MIGRATIONS = ("m007_task_delegated_to.py", "m008_delegated_task_index.py", "m017_block_waiting_tasks.py", "m022_assign_held_tasks.py",
                      "m025_task_assignments.py", "m026_drop_task_delegation.py")
HISTORY_MODULE_NAME = "m007_task_delegated_to"
COLUMN = "delegated_to"


def task_columns(story) -> list[str]:
    return [str(row["name"]) for row in story.container.get(Database).rows(Statement("PRAGMA table_info(tasks)"))]


def test_rebuilding_the_views_after_the_column_is_removed_needs_no_manual_step(new_story):
    story = new_story(fixture=TasksBeforeColumnRemoval)
    code, output_text = story.synced()
    story.expect_rows(code == 0, COLUMN not in task_columns(story), detail=output_text)
    story.expect_text("task list --environment main", "Delegated and open", actor=story.agent)


def test_a_journal_started_on_the_new_code_serves_the_tasks_window_with_the_old_data(new_story):
    story = new_story(fixture=TasksBeforeColumnRemoval)
    code, output_text = story.synced()
    story.expect_rows(code == 0, detail=output_text)
    for task_id in DELEGATED_TASKS:
        table_columns = json.loads(story.run(f"task info {task_id} --json --environment main", actor=story.agent).output_text)
        story.expect_rows(table_columns["assigned_actor_id"] == worker(story).id, detail=str(table_columns))


def test_a_search_for_delegated_to_in_src_finds_only_the_history_migrations():
    found = [f"{path.relative_to(SOURCE_FOLDER)}:{number}" for path in SOURCE_FOLDER.rglob("*.py") if path.parent != TASK_MIGRATIONS or path.name not in HISTORY_MIGRATIONS
             for number, line in enumerate(path.read_text().splitlines(), 1) if COLUMN in line and HISTORY_MODULE_NAME not in line]
    expect_value_4(not found)
