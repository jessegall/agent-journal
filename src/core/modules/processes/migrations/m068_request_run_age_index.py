from engine.database.migration import Migration


class RequestRunAgeIndexMigration(Migration):
    """Lets the pruning of the rows of requests find the oldest ones of an environment without reading the table."""

    number = 68
    statements = ["CREATE INDEX request_runs_environment_ended ON request_runs(environment_id, ended_at)"]
