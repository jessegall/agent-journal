from core.base.database.migration import Migration


class MergeRequestEnvironmentIndexMigration(Migration):
    """Indexes the merge request rows of an environment, newest first."""

    number = 62
    statements = ["CREATE INDEX merge_requests_environment ON merge_requests (environment_id, id)"]
