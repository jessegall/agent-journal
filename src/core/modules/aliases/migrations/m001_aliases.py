from core.base.database.migration import Migration


class AliasesTableMigration(Migration):
    """Creates the aliases table."""

    number = 1
    statements = (
        "CREATE TABLE aliases (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, name TEXT NOT NULL UNIQUE,"
        " line TEXT NOT NULL CHECK (length(line) >= 1), reader_id INTEGER REFERENCES readers(id) ON DELETE SET NULL, description TEXT NOT NULL DEFAULT '',"
        " variables TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(variables)), background INTEGER NOT NULL DEFAULT 0,"
        " plugin_id INTEGER REFERENCES plugins(id) ON DELETE CASCADE, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
