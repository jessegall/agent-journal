from engine.database.rebuild_migration import RebuildMigration


class AssignmentIdsNeverReusedMigration(RebuildMigration):
    """Rebuilds the assignments table with AUTOINCREMENT, so the id of a removed assignment is never given to the
    next one: an event names an assignment by its id, and a kept read of a row's assignments tells a replaced
    assignment from the one before by its id."""

    number = 3
    statements = (
        "CREATE TABLE assignments_rebuilt (id INTEGER PRIMARY KEY AUTOINCREMENT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " subject_model TEXT NOT NULL, subject_id INTEGER NOT NULL, actor_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " source_id INTEGER REFERENCES assignments(id) ON DELETE RESTRICT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (subject_model, subject_id, actor_id)) STRICT",
        "INSERT INTO assignments_rebuilt (id, creator_id, subject_model, subject_id, actor_id, source_id, version, metadata, created_at, updated_at)"
        " SELECT id, creator_id, subject_model, subject_id, actor_id, source_id, version, metadata, created_at, updated_at FROM assignments",
        "DROP TABLE assignments",
        "ALTER TABLE assignments_rebuilt RENAME TO assignments",
        "CREATE INDEX assignments_actor ON assignments (actor_id, subject_model, subject_id)",
        "CREATE INDEX assignments_source ON assignments (source_id) WHERE source_id IS NOT NULL",
    )
