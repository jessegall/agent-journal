from core.base.database.migration import Migration


class TemplatesTableMigration(Migration):
    """Creates the templates table."""

    number = 1
    statements = (
        "CREATE TABLE templates (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 200), brief TEXT NOT NULL DEFAULT '', targets TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(targets)),"
        " purpose TEXT NOT NULL DEFAULT '', parts TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(parts)), commands TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(commands)),"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
