from engine.database.migration import Migration


class CheckpointReviewsMigration(Migration):
    """Creates the reviews a checkpoint started: the reviewer agent, the program and model it runs on and its brief."""

    number = 13
    statements = [
        "CREATE TABLE checkpoint_reviews (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,"
        " phase_id INTEGER NOT NULL REFERENCES phases(id) ON DELETE CASCADE, reviewer_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,"
        " program TEXT NOT NULL, program_model TEXT NOT NULL, brief TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX checkpoint_reviews_phase ON checkpoint_reviews (plan_id, phase_id, id)",
        "CREATE INDEX checkpoint_reviews_environment ON checkpoint_reviews (environment_id, id)",
    ]
