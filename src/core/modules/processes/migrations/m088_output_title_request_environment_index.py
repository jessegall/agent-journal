from engine.database.migration import Migration


class OutputTitleRequestEnvironmentIndexMigration(Migration):
    """Lets the list of an environment's output title requests, newest first, read only that environment's rows."""

    number = 88
    statements = ["CREATE INDEX output_title_requests_environment ON output_title_requests(environment_id, id)"]
