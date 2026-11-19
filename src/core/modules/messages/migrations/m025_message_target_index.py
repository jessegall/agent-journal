from engine.database.migration import Migration


class MessageTargetIndexMigration(Migration):
    """Indexes the messages by the agent they are for, their type and when they were read, so an agent's unread and
    unanswered messages are searched instead of scanned among every message of their type."""

    number = 25
    statements = [
        "CREATE INDEX IF NOT EXISTS messages_target_type_read ON messages(target_agent_id, type, read_at)",
    ]
