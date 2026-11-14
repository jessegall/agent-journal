from engine.database.migration import Migration


class HelperJobCreatedIndexMigration(Migration):
    """Indexes the helper jobs of an environment by when they were made, so a read of a stretch of time finds them."""

    number = 31
    statements = ["CREATE INDEX helper_jobs_environment_created ON helper_jobs (environment_id, created_at)"]
