from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.database.version_four_map_migration import VersionFourMapMigration
from core.base.journal_home import JournalHome
from core.base.upgrade.move_map import MoveMap
from core.base.database.moved_row import MovedRow


def migrated(tmp_path) -> Database:
    database = Database.opened(JournalHome(tmp_path))
    for sql in VersionFourMapMigration.statements:
        database.update(Statement(sql.replace("CREATE TABLE", "CREATE TABLE IF NOT EXISTS")))
    return database


def opened(tmp_path) -> MoveMap:
    return MoveMap(migrated(tmp_path))


def test_the_map_gives_back_the_version_5_id_of_a_row_it_recorded(tmp_path):
    moved = opened(tmp_path)
    moved.record(MovedRow("tasks", 12, "tasks", 3))
    assert moved.new_id("tasks", 12) == 3 and moved.new_id("tasks", 13) is None and moved.new_id("plans", 12) is None


def test_transfer_inserts_a_row_once_and_says_so_the_second_time(tmp_path):
    moved, inserted = opened(tmp_path), []

    def insert() -> int:
        inserted.append(1)
        return 40

    assert moved.transfer("tasks", 12, "tasks", insert) is True
    assert moved.transfer("tasks", 12, "tasks", insert) is False
    assert inserted == [1] and moved.new_id("tasks", 12) == 40 and moved.count() == 1


def test_the_map_survives_a_new_connection_to_the_same_database(tmp_path):
    opened(tmp_path).record(MovedRow("agents", 5, "agents", 20))
    assert opened(tmp_path).new_id("agents", 5) == 20


def test_a_finished_move_is_kept_with_its_counts(tmp_path):
    moved = opened(tmp_path)
    assert moved.finished("tasks", "tasks") is None
    moved.finish("tasks", "tasks", {"moved": {"tasks": 4}})
    assert moved.finished("tasks", "tasks") == {"moved": {"tasks": 4}}


def test_the_tables_are_the_core_migrations_and_hold_one_row_for_a_row_moved_twice(tmp_path):
    moved = opened(tmp_path)
    moved.record(MovedRow("tasks", 1, "tasks", 5))
    moved.record(MovedRow("tasks", 1, "tasks", 6))
    assert moved.count() == 1 and moved.new_id("tasks", 1) == 5
