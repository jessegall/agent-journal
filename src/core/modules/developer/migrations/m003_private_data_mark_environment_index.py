from core.base.database.migration import Migration


class PrivateDataMarkEnvironmentIndexMigration(Migration):
    """Indexes the private data mark rows of an environment, newest first."""

    number = 3
    statements = ["CREATE INDEX private_data_marks_environment ON private_data_marks (environment_id, id)"]
