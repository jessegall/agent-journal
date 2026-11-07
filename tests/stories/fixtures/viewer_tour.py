import json
import sqlite3
from pathlib import Path

from tests.stories.fixtures.version_four import STAMP, USER


def prepare_completed_tour(folder: Path) -> None:
    prepare_tour(folder, True)


def prepare_pending_tour(folder: Path) -> None:
    prepare_tour(folder, False)


def prepare_tour(folder: Path, completed: bool) -> None:
    with sqlite3.connect(folder / "journal.db") as connection:
        connection.execute(
            "INSERT INTO settings (environment_id, key, value, created_at, creator) VALUES (?, ?, ?, ?, ?)",
            (None, "viewer.tour_seen", json.dumps(completed), STAMP, USER),
        )
