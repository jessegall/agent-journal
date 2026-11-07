from core.base.database.migration import Migration


class HelperJobCountsIndexMigration(Migration):
    """Indexes recent jobs with a helper so global split counts avoid scanning all jobs."""

    number = 5
    statements = ["CREATE INDEX helper_jobs_count_created ON helper_jobs (created_at, id) WHERE helper_id IS NOT NULL"]
