from engine.database.rebuild_migration import RebuildMigration

MIGRATION_TIMESTAMP = "strftime('%Y-%m-%dT%H:%M:%S', 'now') || '.000000+00:00'"
KEPT_COLUMNS = "id, environment_id, subject_model, subject_id, requester_id, brief, point_count, state, report, reported_at, version, metadata, created_at, updated_at"


class ReviewAssignmentsMigration(RebuildMigration):
    """Copies the reviewer of each review into the assignments table, as an assignment given by hand, leaving out
    a reviewer that no longer exists, then rebuilds the reviews table without the column reviewer_id and its
    index: the assignment says who reviews a review."""

    number = 6
    statements = (
        "INSERT INTO assignments (creator_id, subject_model, subject_id, actor_id, source_id, version, metadata, created_at, updated_at)"
        " SELECT (SELECT id FROM actors WHERE type = 'core' ORDER BY id LIMIT 1), 'review', reviews.id, reviews.reviewer_id, NULL, 1, '{}',"
        f" {MIGRATION_TIMESTAMP}, {MIGRATION_TIMESTAMP}"
        " FROM reviews JOIN actors ON actors.id = reviews.reviewer_id WHERE reviews.reviewer_id IS NOT NULL"
        " AND NOT EXISTS (SELECT 1 FROM assignments WHERE subject_model = 'review' AND subject_id = reviews.id)",
        "CREATE TABLE reviews_rebuilt (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " subject_model TEXT NOT NULL, subject_id INTEGER NOT NULL, requester_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " brief TEXT NOT NULL DEFAULT '', point_count INTEGER NOT NULL CHECK (point_count >= 0), state TEXT NOT NULL DEFAULT 'queued',"
        " report TEXT NOT NULL DEFAULT '', reported_at TEXT, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        f"INSERT INTO reviews_rebuilt ({KEPT_COLUMNS}) SELECT {KEPT_COLUMNS} FROM reviews",
        "DROP TABLE reviews",
        "ALTER TABLE reviews_rebuilt RENAME TO reviews",
        "CREATE INDEX reviews_queue ON reviews (environment_id, state, id)",
        "CREATE INDEX reviews_subject ON reviews (subject_model, subject_id)",
        "CREATE INDEX reviews_state ON reviews (state)",
    )
