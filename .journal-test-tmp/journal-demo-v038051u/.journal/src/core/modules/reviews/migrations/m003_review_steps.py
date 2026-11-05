from core.base.database.migration import Migration


class ReviewStepsTableMigration(Migration):
    """Creates the review steps table."""

    number = 3
    statements = (
        "CREATE TABLE review_steps (id INTEGER PRIMARY KEY, review_id INTEGER NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, text TEXT NOT NULL CHECK (length(text) > 0),"
        " outcome TEXT NOT NULL DEFAULT 'none' CHECK (outcome IN ('none', 'passed', 'failed')), version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX review_steps_review ON review_steps (review_id, id)",
    )
