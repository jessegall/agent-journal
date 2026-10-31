from core.base.database.migration import Migration


class PhonesTablesMigration(Migration):
    """Creates the phones and pairing codes tables."""

    number = 1
    statements = (
        "CREATE TABLE phones (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " person_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, name TEXT NOT NULL, token_digest TEXT NOT NULL UNIQUE,"
        " state TEXT NOT NULL DEFAULT 'paired', version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE TABLE phone_codes (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " person_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, code_digest TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL,"
        " state TEXT NOT NULL DEFAULT 'open', version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
