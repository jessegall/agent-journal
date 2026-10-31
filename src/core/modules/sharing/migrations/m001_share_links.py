from core.base.database.migration import Migration


class ShareLinksTableMigration(Migration):
    """Creates the share links table."""

    number = 1
    statements = (
        "CREATE TABLE share_links (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, token_digest TEXT NOT NULL UNIQUE, row_model TEXT NOT NULL,"
        " row_id INTEGER NOT NULL, expires_at TEXT NOT NULL, comments INTEGER NOT NULL DEFAULT 0 CHECK (comments IN (0, 1)),"
        " state TEXT NOT NULL DEFAULT 'active', version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
