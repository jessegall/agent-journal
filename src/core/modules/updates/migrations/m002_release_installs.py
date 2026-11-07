from core.base.database.migration import Migration


class ReleaseInstallsMigration(Migration):
    """Keeps pending and failed installation attempts apart from installed releases."""

    number = 2
    statements = (
        "CREATE TABLE release_installs (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " checksum TEXT NOT NULL, tag TEXT NOT NULL, code_version TEXT NOT NULL, step TEXT NOT NULL DEFAULT 'proof', detail TEXT NOT NULL DEFAULT '',"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX release_installs_version_step ON release_installs (code_version, step)",
    )
