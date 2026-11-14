from engine.database.migration import Migration


class WorkerAssignmentsMigration(Migration):
    number = 43
    statements = [
        "CREATE TABLE worker_assignments (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id),"
        " worker_id INTEGER NOT NULL REFERENCES agents(id), creator_id INTEGER NOT NULL REFERENCES actors(id), task_ids TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    ]
