from core.base.database.migration import Migration

ROW_COLUMNS = "version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL"


class DumpsTablesMigration(Migration):
    """Creates the dumps and the items of each."""

    number = 1
    statements = (
        "CREATE TABLE dumps (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, title TEXT NOT NULL DEFAULT '', brief TEXT NOT NULL,"
        f" files TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(files)), outcome TEXT NOT NULL DEFAULT '', closed_at TEXT, {ROW_COLUMNS}) STRICT",
        "CREATE TABLE dump_items (id INTEGER PRIMARY KEY, dump_id INTEGER NOT NULL REFERENCES dumps(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, position INTEGER NOT NULL CHECK (position >= 1), text TEXT NOT NULL,"
        " state TEXT NOT NULL DEFAULT 'new' CHECK (state IN ('new', 'noted', 'filed', 'failed')), note TEXT NOT NULL DEFAULT '',"
        f" summary TEXT NOT NULL DEFAULT '', refs TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(refs)), {ROW_COLUMNS}, UNIQUE (dump_id, position)) STRICT",
    )
