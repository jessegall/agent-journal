from core.base.database.migration import Migration


class ReviewsTablesMigration(Migration):
    """Creates the reviews table with the points of each report."""

    number = 1
    statements = (
        "CREATE TABLE reviews (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " subject_model TEXT NOT NULL, subject_id INTEGER NOT NULL, requester_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " reviewer_id INTEGER REFERENCES agents(id) ON DELETE RESTRICT, brief TEXT NOT NULL DEFAULT '',"
        " point_count INTEGER NOT NULL CHECK (point_count >= 0), state TEXT NOT NULL DEFAULT 'queued', report TEXT NOT NULL DEFAULT '',"
        " reported_at TEXT, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX reviews_queue ON reviews (environment_id, state, id)",
        "CREATE INDEX reviews_reviewer ON reviews (reviewer_id) WHERE reviewer_id IS NOT NULL",
        "CREATE INDEX reviews_subject ON reviews (subject_model, subject_id)",
        "CREATE TABLE review_points (id INTEGER PRIMARY KEY, review_id INTEGER NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, number INTEGER NOT NULL CHECK (number >= 1),"
        " finding TEXT NOT NULL CHECK (finding IN ('passed', 'short', 'undecided')), reason TEXT NOT NULL DEFAULT '',"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (review_id, number)) STRICT",
    )
