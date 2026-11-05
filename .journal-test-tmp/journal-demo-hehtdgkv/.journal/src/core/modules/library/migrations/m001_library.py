from core.base.database.migration import Migration

ROW_COLUMNS = "version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL"


class LibraryTablesMigration(Migration):
    """Creates the table of the connection to a shared server and the table of the rows that follow its items."""

    number = 1
    statements = (
        "CREATE TABLE library_connections (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, server_key TEXT NOT NULL UNIQUE,"
        " address TEXT NOT NULL, name TEXT NOT NULL, user_name TEXT NOT NULL DEFAULT '', role TEXT NOT NULL DEFAULT 'read' CHECK (role IN ('admin', 'edit', 'read')),"
        f" reached_at TEXT, failure TEXT NOT NULL DEFAULT '', stopped TEXT NOT NULL DEFAULT '', {ROW_COLUMNS}) STRICT",
        "CREATE TABLE library_copies (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " share TEXT NOT NULL, item_id INTEGER NOT NULL, row_id INTEGER NOT NULL, base_version INTEGER NOT NULL, base_digest TEXT NOT NULL,"
        " state TEXT NOT NULL DEFAULT 'synced' CHECK (state IN ('synced', 'denied', 'rejected', 'conflict', 'review', 'removed', 'agent')),"
        " unsent_digest TEXT NOT NULL DEFAULT '', server_version INTEGER NOT NULL DEFAULT 0, server_fields TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(server_fields)),"
        f" note TEXT NOT NULL DEFAULT '', {ROW_COLUMNS}, UNIQUE (share, item_id), UNIQUE (share, row_id)) STRICT",
    )
