import sqlite3
from pathlib import Path

from tests.stories.fixtures.version_four import STAMP


def prepare_viewer_environment(folder: Path) -> None:
    with sqlite3.connect(folder / "journal.db") as connection:
        connection.execute(
            "INSERT INTO environments (id, name, branch, key, created_at, creator) VALUES (?, ?, ?, ?, ?, ?)",
            (0, "development", "development", "key-development", STAMP, "system:"),
        )
