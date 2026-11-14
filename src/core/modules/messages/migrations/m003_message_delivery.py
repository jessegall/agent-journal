from engine.database.migration import Migration


class MessageDeliveryMigration(Migration):
    """Keeps when the agent was told of a message, apart from when it read it; a message already
    there counts as told."""

    number = 3
    statements = tuple(["ALTER TABLE messages ADD COLUMN told_at TEXT", "UPDATE messages SET told_at = created_at"])
