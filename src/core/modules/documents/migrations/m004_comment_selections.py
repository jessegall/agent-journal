from core.base.database.migration import Migration


class CommentSelectionsMigration(Migration):
    """Creates the table of what a comment keeps beside its message; a comment from before has no row."""

    number = 4
    statements = (
        "CREATE TABLE comment_selections (id INTEGER PRIMARY KEY, message_id INTEGER NOT NULL UNIQUE REFERENCES messages(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, body TEXT NOT NULL, quote TEXT NOT NULL DEFAULT '', position INTEGER,"
        " selection_type TEXT NOT NULL DEFAULT 'text', revision INTEGER, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
