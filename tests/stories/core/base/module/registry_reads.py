from core.base.database.database import Database
from core.base.journal_container import synced_database_container
from core.base.registry.registry import Registry
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.support.story_checks import expect_total_cost_less, expect_value, expect_value_without

SAMPLE_MODULE = "tests.stories.core.base.module.support.folder_sample.module:FolderNotesModule"


def test_another_container_reads_one_short_row_without_entries(new_story):
    story = new_story(fixture=UserBuilder)
    database = Database.opened(story.home)
    statements = []
    database.connection.set_trace_callback(statements.append)
    try:
        container = synced_database_container(story.home, database)
        cost = database.repeated_work.points()
        expect_value(container.get(Registry) is story.container.get(Registry), True)
        expect_value(len(statements), 1)
        expect_value_without(statements[0].lower(), "entries")
        expect_value(cost.rows, 1)
        expect_value(cost.bytes < 1024, True)
    finally:
        database.close()


def test_a_sync_with_changed_entries_is_seen_by_the_next_container(new_story):
    story = new_story(fixture=UserBuilder)
    saved_registry = story.container.get(Registry)
    story.expect_sync_success(SAMPLE_MODULE)
    container = synced_database_container(story.home, story.container.get(Database))
    synced_registry = container.get(Registry)
    expect_value(synced_registry is saved_registry, False)
    expect_value(any(template.module == "folder.notes" for template in synced_registry.templates), True)


def test_two_homes_keep_their_own_registry_in_one_process(new_story, templates, tmp_path):
    first = new_story(fixture=UserBuilder)
    second = templates.story(tmp_path / "second", (), UserBuilder)
    try:
        second.expect_sync_success(SAMPLE_MODULE)
        first_registry = synced_database_container(first.home, first.container.get(Database)).get(Registry)
        second_registry = synced_database_container(second.home, second.container.get(Database)).get(Registry)
        expect_value(first_registry is first.container.get(Registry), True)
        expect_value(second_registry is second.container.get(Registry), True)
        expect_value(any(template.module == "folder.notes" for template in first_registry.templates), False)
        expect_value(any(template.module == "folder.notes" for template in second_registry.templates), True)
    finally:
        second.close()


def test_a_hook_round_counts_the_container_build_and_loads_no_registry_text(new_story):
    story = new_story(fixture=UserBuilder)
    story.hook("s-1", HookSamples.prompt("Carry on"))
    database = story.container.get(Database)
    start = database.repeated_work.points()
    synced_database_container(story.home, database)
    story.hook("s-1", HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, [])))
    cost = database.repeated_work.points().minus(start)
    print(f"hook round including container: {cost.total} points; {cost.bytes} bytes; {cost.line()}")
    expect_total_cost_less(cost, 100)
    expect_value(any("entries" in sql.lower() for sql in cost.statements), False)
