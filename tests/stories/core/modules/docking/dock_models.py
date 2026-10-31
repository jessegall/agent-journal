from core.base.database.database import Database
from core.base.database.statement import Statement
from core.modules.docking.migrations.m002_docks_of_existing_environments import DocksOfExistingEnvironmentsMigration
from tests.stories.core.modules.docking.support.dock_samples import SAMPLE
from tests.stories.core.support.fixtures import UserJoined


def test_an_item_goes_through_undock_and_dock(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    dock_id = story.new_row_id("dock make --environment main")
    item_id = story.new_row_id(f"dock-item make {dock_id} docksample.task task 1")
    story.expect_text(f"dock-item undock {item_id}", "state: undocked")
    story.expect_text(f"dock-item dock {item_id}", "state: docked")


def test_a_second_dock_for_one_environment_is_refused(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    story.new_row_id("dock make --environment main")
    story.expect_refusal("dock make --environment main", "exists already")


def test_deleting_a_dock_deletes_its_items(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    dock_id = story.new_row_id("dock make --environment main")
    item_id = story.new_row_id(f"dock-item make {dock_id} docksample.task task 1")
    story.expect_success(f"dock delete {dock_id}")
    story.expect_refusal(f"dock-item show {item_id}", "no dock-item")


def test_docking_a_task_changes_no_task_row(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    task_id = story.new_row_id('task make "Fix it" --environment main', actor=story.user)
    before = story.run(f"task show {task_id}").output_text
    dock_id = story.new_row_id("dock make --environment main")
    story.new_row_id(f"dock-item make {dock_id} docksample.task task {task_id}")
    assert story.run(f"task show {task_id}").output_text == before


def test_an_environment_made_gets_its_dock_from_the_listener(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    story.run("environment make elsewhere /work/elsewhere")
    story.run_listeners()
    story.expect_text("dock list", "elsewhere" if False else "2  2")


def test_the_environment_made_before_the_module_has_a_dock_when_the_listener_runs(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    story.run_listeners()
    story.expect_text("dock list --environment 1", "1  1")


def test_add_keep_and_remove_run_from_the_command_line(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    item_id = story.new_row_id("dock add docksample.task task 1 --environment main", actor=story.user)
    story.expect_text(f"dock keep {item_id}", "kept: True")
    story.expect_text(f"dock remove {item_id}", "state: undocked")


def test_the_migration_makes_the_dock_of_every_environment_that_has_none(new_story):
    story = new_story(SAMPLE, fixture=UserJoined)
    story.run("environment make elsewhere /work/elsewhere")
    database = story.container.get(Database)
    database.update(Statement("DELETE FROM docks"))
    for sql in DocksOfExistingEnvironmentsMigration.statements:
        database.update(Statement(sql))
    assert database.rows(Statement("SELECT count(*) FROM docks"))[0][0] == 2
