from core.base.database.migration import Migration


class ReaderRequestsMigration(Migration):
    """Creates reader requests and links process parts to them."""

    number = 22
    statements = (
        "CREATE TABLE reader_requests (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id),"
        " creator_id INTEGER NOT NULL REFERENCES actors(id), command_key TEXT NOT NULL, command TEXT NOT NULL,"
        " category TEXT NOT NULL, reason TEXT NOT NULL, expires_at TEXT NOT NULL,"
        " sample_process_id INTEGER REFERENCES processes(id), reader_id INTEGER REFERENCES readers(id),"
        " skip_reason TEXT NOT NULL DEFAULT '', completed_at TEXT, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE UNIQUE INDEX reader_requests_open_command ON reader_requests(environment_id, command_key) WHERE completed_at IS NULL",
        "ALTER TABLE process_parts ADD COLUMN reader_request_id INTEGER REFERENCES reader_requests(id)",
        "CREATE INDEX process_parts_reader_request ON process_parts(reader_request_id)",
    )
