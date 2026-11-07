import json
import sqlite3
from pathlib import Path

from tests.stories.fixtures.version_four import STAMP, USER

ROW_SEQUENCES = (
    (101, "Building a plan", "plan.created", "system:"),
    (102, "Filing a document that is already written", "doc.created", "system:"),
    (103, "Applying a plan's reviews", "plan.review_started", "system:"),
    (104, "Ship a change to Lily", "trigger:1", USER),
)


def prepare_row_sequences(folder: Path) -> None:
    steps = json.dumps([{"title": "Read the copied steps", "instructions": "Keep these instructions."}])
    with sqlite3.connect(folder / "journal.db") as connection:
        connection.execute("DELETE FROM triggers")
        connection.executemany(
            "INSERT INTO sequences (id, title, steps, locked, triggers, created_at, creator) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [(number, title, steps, 0, json.dumps([{"trigger_type": "row", "moment": event}]), STAMP, creator)
             for number, title, event, creator in ROW_SEQUENCES],
        )
