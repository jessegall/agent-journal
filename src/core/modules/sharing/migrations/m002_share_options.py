from core.base.database.migration import Migration


class ShareOptionsMigration(Migration):
    """Lets a link never end, gives it a password and a count of its views, and adds visitors' comments."""

    number = 2
    statements = (
        "CREATE TABLE share_links_new (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, token_digest TEXT NOT NULL UNIQUE, row_model TEXT NOT NULL,"
        " row_id INTEGER NOT NULL, expires_at TEXT, comments INTEGER NOT NULL DEFAULT 0 CHECK (comments IN (0, 1)), password_digest TEXT,"
        " locked INTEGER NOT NULL DEFAULT 0 CHECK (locked IN (0, 1)), view_count INTEGER NOT NULL DEFAULT 0,"
        " state TEXT NOT NULL DEFAULT 'active', version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "INSERT INTO share_links_new (id, environment_id, creator_id, token_digest, row_model, row_id, expires_at, comments, state, version, metadata, created_at, updated_at)"
        " SELECT id, environment_id, creator_id, token_digest, row_model, row_id, expires_at, comments, state, version, metadata, created_at, updated_at FROM share_links",
        "DROP TABLE share_links",
        "ALTER TABLE share_links_new RENAME TO share_links",
        "CREATE TABLE share_comments (id INTEGER PRIMARY KEY, share_link_id INTEGER NOT NULL REFERENCES share_links(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, visitor_name TEXT NOT NULL, text TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
