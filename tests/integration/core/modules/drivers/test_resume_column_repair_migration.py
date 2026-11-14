import sqlite3

from engine.database.database import Database
from engine.journal.journal_home import JournalHome
from core.modules.drivers.migrations.m064_resume_column_repair import ResumeColumnRepairMigration


def columns_after_repair(tmp_path, wake_column: str) -> set[str]:
    home = JournalHome(tmp_path / "journal")
    home.folder.mkdir()
    connection = sqlite3.connect(home.database)
    connection.execute(f"CREATE TABLE context_compactions (id INTEGER PRIMARY KEY, {wake_column} TEXT)")
    connection.close()
    database = Database.opened(home)
    ResumeColumnRepairMigration().run(database)
    database.close()
    with sqlite3.connect(home.database) as reopened:
        return {row[1] for row in reopened.execute("PRAGMA table_info(context_compactions)")}


def test_a_database_that_kept_the_wake_column_gets_it_renamed(tmp_path):
    assert columns_after_repair(tmp_path, "woken_at") == {"id", "resumed_at"}


def test_a_database_that_renamed_it_at_number_63_is_left_as_it_is(tmp_path):
    assert columns_after_repair(tmp_path, "resumed_at") == {"id", "resumed_at"}
