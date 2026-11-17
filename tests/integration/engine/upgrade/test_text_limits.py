import sqlite3

from tests.integration.support.upgraded_journal import UpgradedJournal

LONG_TITLE = "a title version 4 let run on " * 12


def long_and_empty_titles(folder):
    connection = sqlite3.connect(folder / "journal.db")
    tables = [row[0] for row in connection.execute("SELECT name FROM sqlite_master WHERE type = 'table'")]
    for table in tables:
        columns = [row[1] for row in connection.execute(f"PRAGMA table_info({table})")]
        if "title" in columns:
            connection.execute(f"UPDATE {table} SET title = CASE WHEN rowid % 2 = 0 THEN ? ELSE '' END", [LONG_TITLE])
    connection.commit()
    connection.close()


def test_titles_longer_or_shorter_than_version_5_allows_are_fitted_and_the_upgrade_finishes(journal_with):
    story = UpgradedJournal.upgraded(journal_with(), long_and_empty_titles)
    story.expect_text("task list", "(empty in version 4)", "a title version 4 let run on")
