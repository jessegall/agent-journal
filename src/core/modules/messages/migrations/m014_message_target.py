from engine.database.migration import Migration


class MessageTargetMigration(Migration):
    number = 14
    statements = [
        "ALTER TABLE messages ADD COLUMN target_agent_id INTEGER REFERENCES agents(id)",
        "CREATE INDEX messages_target_unread ON messages(environment_id, target_agent_id, type, read_at, delivered_at, id)",
        "DROP VIEW IF EXISTS chat_messages",
    ]
