from core.base.database.migration import Migration


class WorkerRoutesMigration(Migration):
    """Stores ordered task routes within each environment."""

    number = 40
    statements = [
        "CREATE TABLE worker_routes (id INTEGER PRIMARY KEY AUTOINCREMENT, version INTEGER NOT NULL, metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, updated_at TEXT NOT NULL, environment_id INTEGER NOT NULL REFERENCES environments(id), creator_id INTEGER NOT NULL REFERENCES actors(id), position INTEGER NOT NULL, program TEXT NOT NULL DEFAULT '', tags TEXT NOT NULL DEFAULT '[]', minimum_complexity INTEGER, maximum_complexity INTEGER, tier TEXT, strict INTEGER NOT NULL DEFAULT 0)",
        "CREATE UNIQUE INDEX worker_routes_position ON worker_routes (environment_id, position)",
        "CREATE INDEX worker_routes_all_positions ON worker_routes (position, id)",
    ]
