import re
import shutil
import sqlite3
from pathlib import Path

from core.base.file_access import FileAccess

CHECKOUT_FILE = "checkout"
REWRITTEN_FILES = ("module_list", "program_table")


class TemplateAdaptation:
    """Makes a template built in one checkout usable in another: a template holds the paths of the checkout that built
    it (the files of its skills, for one), so a copy for another checkout has that checkout's path put in place of the
    builder's, in its databases and its lists; it is made once for each checkout and kept beside the template."""

    def __init__(self, checkout: Path) -> None:
        self.checkout = str(checkout)

    def built_in(self, folder: Path) -> str:
        file = folder / CHECKOUT_FILE
        return FileAccess.shared().read(file) if file.is_file() else self.checkout

    def mark(self, folder: Path) -> None:
        FileAccess.shared().write(folder / CHECKOUT_FILE, self.checkout)

    def adapted(self, template: Path, adapted: Path) -> None:
        """Copies the template into the adapted folder with its builder's checkout path replaced by this checkout's."""
        builder = self.built_in(template)
        shutil.rmtree(adapted, ignore_errors=True)
        shutil.copytree(template, adapted)
        for database in adapted.rglob("*.db"):
            self.rewrite_database(database, builder)
        for name in REWRITTEN_FILES:
            for file in adapted.rglob(name):
                FileAccess.shared().write(file, FileAccess.shared().read(file).replace(builder, self.checkout))
        self.mark(adapted)

    def rewrite_database(self, database: Path, builder: str) -> None:
        connection = sqlite3.connect(database, autocommit=True)
        try:
            for table, columns in self.text_columns(connection):
                for column in columns:
                    connection.execute(f'UPDATE "{table}" SET "{column}" = replace("{column}", ?, ?) WHERE instr("{column}", ?) > 0', (builder, self.checkout, builder))
        finally:
            connection.close()

    @staticmethod
    def text_columns(connection: sqlite3.Connection) -> list[tuple[str, list[str]]]:
        tables = [row[0] for row in connection.execute("SELECT name FROM sqlite_master WHERE type = 'table' AND sql NOT LIKE 'CREATE VIRTUAL%' AND name NOT LIKE 'sqlite_%'")]
        found = []
        for table in tables:
            columns = [row[1] for row in connection.execute(f'PRAGMA table_info("{table}")') if re.search("CHAR|TEXT|CLOB|JSON", row[2].upper() or "TEXT")]
            if columns:
                found.append((table, columns))
        return found
