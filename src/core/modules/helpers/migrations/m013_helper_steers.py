from engine.database.migration import Migration


class HelperSteersMigration(Migration):
    """Keeps what a parent adds to a busy helper's open job, and the helper's answer to it."""

    number = 13
    statements = (
        "CREATE TABLE helper_steers (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " helper_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT, job_id INTEGER NOT NULL REFERENCES helper_jobs(id) ON DELETE RESTRICT,"
        " text TEXT NOT NULL, answer TEXT, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX helper_steers_helper_answer ON helper_steers (helper_id, answer)",
        "CREATE INDEX helper_steers_job ON helper_steers (job_id, id)",
        "CREATE INDEX helper_steers_environment ON helper_steers (environment_id, id)",
    )
