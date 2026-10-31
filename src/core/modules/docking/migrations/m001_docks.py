from core.base.database.migration import Migration


class DocksTableMigration(Migration):
    """Creates the docks table, one dock to an environment, and the dock items table, whose items go with their dock."""

    number = 1
    statements = (
        "CREATE TABLE docks (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL UNIQUE REFERENCES environments(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE TABLE dock_items (id INTEGER PRIMARY KEY, dock_id INTEGER NOT NULL REFERENCES docks(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, type TEXT NOT NULL, target_model TEXT NOT NULL, target_id INTEGER NOT NULL,"
        " kept INTEGER NOT NULL DEFAULT 0 CHECK (kept IN (0, 1)), state TEXT NOT NULL DEFAULT 'docked' CHECK (state IN ('docked', 'undocked')),"
        " leaves_at TEXT, undocked_at TEXT, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX dock_items_dock ON dock_items (dock_id, id)",
    )
