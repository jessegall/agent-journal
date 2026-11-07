from core.base.database.migration import Migration


class WorkerOperationsMigration(Migration):
    number = 38
    statements = [
        "CREATE TABLE worker_operations (id INTEGER PRIMARY KEY, worker_id INTEGER NOT NULL REFERENCES agents(id),"
        " creator_id INTEGER NOT NULL REFERENCES actors(id), actor_type TEXT NOT NULL,"
        " process_id INTEGER NOT NULL UNIQUE REFERENCES processes(id), line TEXT NOT NULL,"
        " plugin_script TEXT NOT NULL DEFAULT '', started_at TEXT, ended_at TEXT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE UNIQUE INDEX worker_operations_active ON worker_operations (worker_id) WHERE ended_at IS NULL",
    ]
