from engine.database.migration import Migration


class ScheduledJobsEnvironmentIndexMigration(Migration):
    """Indexes scheduled jobs by environment, so the list of one environment reads no other row."""

    number = 5
    statements = [
        "CREATE INDEX scheduled_jobs_environment ON scheduled_jobs (environment_id, id)",
    ]
