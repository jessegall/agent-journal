from core.base.database.migration import Migration


class RevisionAuthorsMigration(Migration):
    """Records revision authors and documents held open for editing."""

    number = 6
    statements = (
        "ALTER TABLE doc_revisions ADD COLUMN author_id INTEGER REFERENCES actors(id) ON DELETE RESTRICT",
        "UPDATE doc_revisions SET author_id = creator_id",
        "CREATE TABLE open_documents (id INTEGER PRIMARY KEY, doc_id INTEGER NOT NULL UNIQUE REFERENCES docs(id) ON DELETE CASCADE,"
        " author_id INTEGER NOT NULL UNIQUE REFERENCES actors(id) ON DELETE RESTRICT,"
        " revision_id INTEGER REFERENCES doc_revisions(id) ON DELETE RESTRICT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
