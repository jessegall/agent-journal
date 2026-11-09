from core.base.database.migration import Migration


class CommandPrefixesMigration(Migration):
    """Creates the table of the kinds agents gave commands the journal could not classify."""

    number = 4
    statements = (
        "CREATE TABLE command_kinds (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " words TEXT NOT NULL UNIQUE CHECK (length(words) >= 1), category TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
