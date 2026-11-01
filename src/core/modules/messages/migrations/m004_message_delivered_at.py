from core.base.database.migration import Migration


class MessageDeliveredAtMigration(Migration):
    """The time a message reached the agent is named delivered_at."""

    number = 4
    statements = tuple(["ALTER TABLE messages RENAME COLUMN told_at TO delivered_at"])
