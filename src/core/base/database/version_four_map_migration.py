from core.base.database.migration import Migration
from core.base.database.timestamp_sql import TIMESTAMP_SQL


class VersionFourMapMigration(Migration):
    """Creates the tables an upgrade from version 4 keeps: each moved row with its version 4 and version 5 table and
    id, and each module's move with when it finished and its counts."""

    number = 3
    statements = (
        "CREATE TABLE version_four_map (old_table TEXT NOT NULL, old_id INTEGER NOT NULL, new_table TEXT NOT NULL, new_id INTEGER NOT NULL,"
        f" moved_at TEXT NOT NULL DEFAULT ({TIMESTAMP_SQL}), PRIMARY KEY (old_table, old_id)) STRICT",
        "CREATE TABLE version_four_moves (module TEXT NOT NULL, move TEXT NOT NULL, finished_at TEXT NOT NULL,"
        " counts TEXT NOT NULL CHECK (json_valid(counts)), PRIMARY KEY (module, move)) STRICT",
    )
