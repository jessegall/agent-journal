from engine.file.file_access import FileAccess
import sqlite3

from engine.journal.journal_home import JournalHome


def replace_with_copy(home: JournalHome) -> None:
    copy_file = home.database.with_name(f"{home.database.name}.copy")
    source, copy = sqlite3.connect(home.database), sqlite3.connect(copy_file)
    try:
        source.backup(copy)
    finally:
        copy.close()
        source.close()
    FileAccess.replace(copy_file, home.database)
