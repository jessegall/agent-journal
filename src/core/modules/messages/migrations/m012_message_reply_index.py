from engine.database.migration import Migration


class MessageReplyIndexMigration(Migration):
    """Indexes replies by parent message and message type."""

    number = 12
    statements = ["CREATE INDEX messages_parent_type ON messages (parent_id, type, id)"]
