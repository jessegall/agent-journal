from core.base.database.migration import Migration


class MessageParentEnvironmentMigration(Migration):
    """Indexes conversation children within an environment."""

    number = 20
    statements = ["CREATE INDEX messages_environment_parent ON messages (environment_id, parent_id)"]
