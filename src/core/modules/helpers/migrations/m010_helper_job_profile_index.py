from engine.database.migration import Migration


class HelperJobProfileIndexMigration(Migration):
    """Indexes the jobs of a profile newest first, which a helper start reads for a job it knows and the cost of a
    profile reads for its newest jobs."""

    number = 10
    statements = ["CREATE INDEX IF NOT EXISTS helper_jobs_profile ON helper_jobs (profile, id)"]
