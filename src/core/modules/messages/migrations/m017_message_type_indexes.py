from engine.database.migration import Migration


class MessageTypeIndexesMigration(Migration):
    """Indexes messages by type, for reads across all environments."""

    number = 17
    statements = ["CREATE INDEX messages_type_unread ON messages (type, id) WHERE read_at IS NULL", "CREATE INDEX messages_type_created ON messages (type, created_at)"]
