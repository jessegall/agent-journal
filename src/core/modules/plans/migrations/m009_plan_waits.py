from engine.database.migration import Migration


class PlanWaitsMigration(Migration):
    """Creates the table of the plans a blocked plan waits on."""

    number = 9
    statements = (
        "CREATE TABLE plan_waits (id INTEGER PRIMARY KEY, plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, blocker_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,"
        " ended_at TEXT, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, CHECK (plan_id != blocker_id)) STRICT",
        "CREATE INDEX plan_waits_plan ON plan_waits (plan_id, ended_at)",
        "CREATE INDEX plan_waits_blocker ON plan_waits (blocker_id, ended_at)",
    )
