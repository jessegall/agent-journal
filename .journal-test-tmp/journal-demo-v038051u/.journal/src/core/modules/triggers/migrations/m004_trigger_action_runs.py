from core.base.database.migration import Migration


class TriggerActionRunsMigration(Migration):
    number = 4
    statements = [
        "CREATE TABLE trigger_action_runs (id INTEGER PRIMARY KEY, version INTEGER NOT NULL DEFAULT 1,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id), trigger_id INTEGER NOT NULL REFERENCES triggers(id),"
        " process_id INTEGER NOT NULL UNIQUE REFERENCES processes(id), notify_agent INTEGER NOT NULL DEFAULT 0,"
        " delivered_at TEXT, metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, updated_at TEXT NOT NULL)"
    ]
