from engine.database.rebuild_migration import RebuildMigration


class HelperGrantAgentReferenceMigration(RebuildMigration):
    """The helper of a helper grant references agents, as every column that names an agent does."""

    number = 12
    statements = (
        "CREATE TABLE helper_grants_rebuilt (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT, helper_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT, program TEXT NOT NULL, subcommands TEXT NOT NULL, arguments TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "INSERT INTO helper_grants_rebuilt (id, environment_id, helper_id, program, subcommands, arguments, version, metadata, created_at, updated_at) SELECT id, environment_id, helper_id, program, subcommands, arguments, version, metadata, created_at, updated_at FROM helper_grants",
        "DROP TABLE helper_grants",
        "ALTER TABLE helper_grants_rebuilt RENAME TO helper_grants",
        "CREATE UNIQUE INDEX helper_grants_helper_program ON helper_grants (helper_id, program)",
        "CREATE INDEX helper_grants_environment ON helper_grants (environment_id, id)",
    )
