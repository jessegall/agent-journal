from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.upgrade.move_map import MoveMap
from tests.stories.core.support.fixtures import MainEnvironment


def test_the_synced_database_holds_the_two_upgrade_tables_and_a_row_moved_twice_is_one_row_and_one_entry(new_story):
    story = new_story(fixture=MainEnvironment)
    database = story.container.get(Database)
    names = {row["name"] for row in database.rows(Statement("SELECT name FROM sqlite_master WHERE type = 'table'"))}
    assert {"version_four_map", "version_four_moves"} <= names
    moved = MoveMap(database)
    inserts = []

    def insert() -> int:
        inserts.append(1)
        return database.insert(Statement("INSERT INTO settings (key, value, creator_id, created_at, updated_at) VALUES ('upgrade.sample', '1', 1, 'now', 'now')"))

    assert moved.transfer("settings", 5, "settings", insert) is True
    assert moved.transfer("settings", 5, "settings", insert) is False
    assert inserts == [1] and moved.count() == 1
    assert database.rows(Statement("SELECT count(*) AS total FROM settings WHERE key = 'upgrade.sample'"))[0]["total"] == 1
