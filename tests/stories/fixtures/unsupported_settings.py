import json
import sqlite3
from pathlib import Path

from tests.stories.fixtures.version_four import STAMP, USER

UNSUPPORTED_SETTINGS = (
    ("features.checks", True),
    ("features.sequences", True),
    ("features.sharing", True),
    ("features.templates", True),
    ("features.triggers", True),
    ("plans.test_commands", "journal suite, journal vitest"),
    ("workers.builder_may_queue", False),
    ("workers.mode", "builder"),
    ("workers.test_command", "./scripts/test.sh"),
    ("workers.test_command_proof", "--filter=ApplyStockCountTest"),
)


def prepare_unsupported_settings(folder: Path) -> None:
    with sqlite3.connect(folder / "journal.db") as connection:
        connection.executemany(
            "INSERT INTO settings (environment_id, key, value, created_at, creator) VALUES (?, ?, ?, ?, ?)",
            [(None, key, json.dumps(value), STAMP, USER) for key, value in UNSUPPORTED_SETTINGS],
        )
