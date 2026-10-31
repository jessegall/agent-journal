from core.base.database.migration import Migration

ROW_COLUMNS = "version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL"
TEXT_COLUMNS = ("environment_id INTEGER REFERENCES environments(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
           " title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 200), abstract TEXT NOT NULL CHECK (length(abstract) BETWEEN 1 AND 200), body TEXT NOT NULL,"
           " close_reason TEXT NOT NULL DEFAULT ''")


class DocumentsTablesMigration(Migration):
    """Creates the documents, reports, document revisions and links tables."""

    number = 1
    statements = (
        f"CREATE TABLE docs (id INTEGER PRIMARY KEY, {TEXT_COLUMNS}, {ROW_COLUMNS}) STRICT",
        f"CREATE TABLE reports (id INTEGER PRIMARY KEY, {TEXT_COLUMNS}, {ROW_COLUMNS}) STRICT",
        "CREATE TABLE doc_revisions (id INTEGER PRIMARY KEY, doc_id INTEGER NOT NULL REFERENCES docs(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, number INTEGER NOT NULL, title TEXT NOT NULL, abstract TEXT NOT NULL,"
        f" body TEXT NOT NULL, change TEXT NOT NULL, closes_at TEXT NOT NULL, {ROW_COLUMNS}, UNIQUE (doc_id, number)) STRICT",
        "CREATE TABLE links (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, source_model TEXT NOT NULL,"
        " source_id INTEGER NOT NULL, target_model TEXT NOT NULL, target_id INTEGER NOT NULL, link_type TEXT NOT NULL,"
        f" {ROW_COLUMNS}, UNIQUE (source_model, source_id, target_model, target_id, link_type)) STRICT",
        "CREATE INDEX links_target ON links (target_model, target_id, link_type)",
    )
