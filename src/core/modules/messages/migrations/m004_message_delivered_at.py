from engine.database.migration import Migration


class MessageDeliveredColumnMigration(Migration):
    """The time a message reached the agent is named delivered_at."""

    number = 4
    statements = ("ALTER TABLE messages RENAME COLUMN told_at TO delivered_at",)
