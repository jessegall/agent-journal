from engine.database.rebuild_migration import RebuildMigration
from engine.database.database import Database
from engine.database.index_table import IndexTable


class PlainMemoriesMigration(RebuildMigration):
    """Rebuilds the memories table with no type and no due time, each memory in one environment, and drops memory
    types. It runs here because the rules must first take the memories of the rule type."""

    number = 3
    statements = (
        "CREATE TABLE memories_rebuilt (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " agent_id INTEGER REFERENCES agents(id) ON DELETE RESTRICT, task_id INTEGER REFERENCES tasks(id) ON DELETE SET NULL,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, text TEXT NOT NULL CHECK (length(text) BETWEEN 1 AND 400),"
        " reason TEXT NOT NULL DEFAULT '', weight INTEGER NOT NULL DEFAULT 5 CHECK (weight BETWEEN 0 AND 10), state TEXT NOT NULL DEFAULT 'active',"
        " removed_at TEXT, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "INSERT INTO memories_rebuilt (id, environment_id, agent_id, task_id, creator_id, text, reason, weight, state, removed_at, version, metadata, created_at, updated_at)"
        " SELECT id, environment_id, agent_id, task_id, creator_id, text, reason, weight, state, removed_at, version, metadata, created_at, updated_at FROM memories",
        "DROP TABLE memories",
        "ALTER TABLE memories_rebuilt RENAME TO memories",
        "CREATE INDEX memories_active ON memories (environment_id, agent_id, weight) WHERE state = 'active' AND weight > 0",
        "CREATE INDEX memories_task ON memories (task_id) WHERE task_id IS NOT NULL",
        "DROP TABLE memory_type_switches",
        "DROP TABLE memory_types",
    )

    def rebuild(self, database: Database) -> None:
        indexes = IndexTable(database)
        statements = indexes.statements("memories")
        super().rebuild(database)
        indexes.restore(statements)
