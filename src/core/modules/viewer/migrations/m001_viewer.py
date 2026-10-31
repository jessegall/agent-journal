from core.base.database.migration import Migration


class ViewerTablesMigration(Migration):
    """Creates the viewer's tables: each person's layouts, one per environment, suite, page and driver, and the
    permissions each person gave a window or a module in one environment."""

    number = 1
    statements = (
        "CREATE TABLE viewer_layouts (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " person_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " suite TEXT NOT NULL, page TEXT NOT NULL, driver TEXT NOT NULL DEFAULT '', layout TEXT NOT NULL CHECK (json_valid(layout)),"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (environment_id, person_id, suite, page, driver)) STRICT",
        "CREATE TABLE window_permissions (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " person_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " subject TEXT NOT NULL, type TEXT NOT NULL, lines TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(lines)), fingerprint TEXT NOT NULL DEFAULT '',"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (environment_id, person_id, subject, type)) STRICT",
    )
