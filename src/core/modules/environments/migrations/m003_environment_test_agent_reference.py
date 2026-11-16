from engine.database.rebuild_migration import RebuildMigration


class EnvironmentTestAgentReferenceMigration(RebuildMigration):
    """The test agent of an environment references agents, as every column that names an agent does."""

    number = 3
    statements = (
        "CREATE TABLE environments_rebuilt (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, name TEXT NOT NULL UNIQUE, folder TEXT NOT NULL, branch TEXT NOT NULL DEFAULT '', version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL, test INTEGER NOT NULL DEFAULT 0 CHECK (test IN (0, 1)), test_agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL) STRICT",
        "INSERT INTO environments_rebuilt (id, creator_id, name, folder, branch, version, metadata, created_at, updated_at, test, test_agent_id) SELECT id, creator_id, name, folder, branch, version, metadata, created_at, updated_at, test, test_agent_id FROM environments",
        "DROP TABLE environments",
        "ALTER TABLE environments_rebuilt RENAME TO environments",
    )
