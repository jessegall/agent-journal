from engine.database.migration import Migration


class HelperGrantEnvironmentIndexMigration(Migration):
    """Indexes the helper grant rows of an environment, newest first."""

    number = 9
    statements = ["CREATE INDEX helper_grants_environment ON helper_grants (environment_id, id)"]
