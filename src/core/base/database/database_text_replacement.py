import re
import sqlite3
from pathlib import Path


class DatabaseTextReplacement:
    """Replaces a text in every text column of a database file and clears the pages that held it."""

    def __init__(self, database: Path) -> None:
        self.database = database

    def replace(self, text: str, replacement: str) -> None:
        connection = sqlite3.connect(self.database, autocommit=True)
        try:
            connection.execute("PRAGMA secure_delete = ON")
            for table, columns in self.text_columns(connection):
                for column in columns:
                    connection.execute(f'UPDATE "{table}" SET "{column}" = replace("{column}", ?, ?) WHERE instr("{column}", ?) > 0', (text, replacement, text))
            connection.execute("VACUUM")
        finally:
            connection.close()

    @staticmethod
    def text_columns(connection: sqlite3.Connection) -> list[tuple[str, list[str]]]:
        table_names = [row[0] for row in connection.execute("SELECT name FROM sqlite_master WHERE type = 'table' AND sql NOT LIKE 'CREATE VIRTUAL%' AND name NOT LIKE 'sqlite_%'")]
        tables = []
        for table in table_names:
            columns = [row[1] for row in connection.execute(f'PRAGMA table_info("{table}")') if re.search("CHAR|TEXT|CLOB|JSON", row[2].upper() or "TEXT")]
            if columns:
                tables.append((table, columns))
        return tables
