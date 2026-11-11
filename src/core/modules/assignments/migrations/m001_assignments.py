from engine.database.migration import Migration


class AssignmentsTableMigration(Migration):
    """Creates the assignments table: one row for each row of a model given to an actor."""

    number = 1
    statements = (
        "CREATE TABLE assignments (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " subject_model TEXT NOT NULL, subject_id INTEGER NOT NULL, actor_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " via_id INTEGER REFERENCES assignments(id) ON DELETE RESTRICT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (subject_model, subject_id, actor_id)) STRICT",
        "CREATE INDEX assignments_actor ON assignments (actor_id, subject_model)",
        "CREATE INDEX assignments_via ON assignments (via_id) WHERE via_id IS NOT NULL",
    )
