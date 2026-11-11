import sqlite3
from pathlib import Path

from engine.database.database import Database
from engine.file.file_clone import FileClone
from engine.testing.stories.working_journal import WorkingJournal


def template_file(folder: Path) -> Path:
    path = folder / "template.db"
    connection = sqlite3.connect(path)
    connection.execute("PRAGMA journal_mode = WAL")
    connection.execute("CREATE TABLE notes (id INTEGER PRIMARY KEY, text TEXT NOT NULL)")
    connection.commit()
    connection.close()
    return path


def written_story(journal: WorkingJournal, text: str) -> None:
    journal.reserve()
    database = Database.configured(sqlite3.connect(journal.file, autocommit=True))
    journal.defer_writes(database)
    database.connection.execute("INSERT INTO notes (text) VALUES (?)", [text])
    database.close()
    journal.discard_writes()


def test_stories_on_one_working_journal_roll_back_their_writes_without_copying_the_database(tmp_path, monkeypatch):
    journal = WorkingJournal(template_file(tmp_path), tmp_path / "working.db")
    copies: list[Path] = []
    original_copy = FileClone.copy
    monkeypatch.setattr(FileClone, "copy", lambda source, target: copies.append(target) or original_copy(source, target))
    for number in range(3):
        written_story(journal, f"story {number}")
    rows = sqlite3.connect(journal.file).execute("SELECT count(*) FROM notes").fetchone()[0]
    assert (rows, copies, journal.is_taken) == (0, [], False)
