from core.base.database.database import Database
from core.base.journal_home import JournalHome
from core.base.upgrade.id_map import IdMap


def opened(tmp_path) -> IdMap:
    return IdMap(Database.opened(JournalHome(tmp_path)))


def test_the_map_gives_back_the_version_5_id_of_a_row_it_recorded(tmp_path):
    moved = opened(tmp_path)
    moved.record("tasks", 12, "tasks", 3)
    assert moved.new_id("tasks", 12) == 3 and moved.new_id("tasks", 13) is None and moved.new_id("plans", 12) is None


def test_the_same_version_4_row_is_recorded_once(tmp_path):
    moved = opened(tmp_path)
    moved.record("tasks", 12, "tasks", 3)
    moved.record("tasks", 12, "tasks", 4)
    assert moved.new_id("tasks", 12) == 3 and moved.count() == 1


def test_the_map_survives_a_new_connection_to_the_same_database(tmp_path):
    first = opened(tmp_path)
    first.record("agents", 5, "agents", 20)
    assert opened(tmp_path).new_id("agents", 5) == 20
