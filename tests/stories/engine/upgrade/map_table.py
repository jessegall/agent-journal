from engine.database.database import Database
from engine.database.statement import Statement
from engine.upgrade.move_map import MoveMap
from tests.stories.core.support.fixtures import MainEnvironment
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_value, expect_version_four_map_limit


def test_the_synced_database_holds_the_two_upgrade_tables_and_a_row_moved_twice_is_one_row_and_one_entry(new_story):
    story = new_story(fixture=MainEnvironment)
    database = story.container.get(Database)
    names = {row["name"] for row in database.rows(Statement("SELECT name FROM sqlite_master WHERE type = 'table'"))}
    expect_version_four_map_limit("version_four_map", "version_four_moves", names)
    moved = MoveMap(database)
    inserts = []

    def insert() -> int:
        inserts.append(1)
        return database.insert(Statement("INSERT INTO settings (key, value, creator_id, created_at, updated_at) VALUES ('upgrade.sample', '1', 1, 'now', 'now')"))

    expect_transfer_moved(moved, "settings", 5, "settings", insert, True)
    expect_transfer_moved(moved, "settings", 5, "settings", insert, False)
    expect_value(inserts, [1])
    expect_count_moved(moved, 1)
    expect_row(database.rows(Statement("SELECT count(*) AS total FROM settings WHERE key = 'upgrade.sample'"))[0], total=1)


def expect_count_moved(moved, expected) -> None:
    actual = moved.count()
    assert actual == expected, actual


def expect_transfer_moved(moved, text, number, text_2, insert, expected) -> None:
    actual = moved.transfer(text, number, text_2, insert)
    assert actual is expected, actual
