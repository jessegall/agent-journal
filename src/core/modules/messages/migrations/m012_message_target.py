from core.base.database.migration import Migration
from core.modules.messages.models.support.views import CHAT_MESSAGES_SELECT


class MessageTargetMigration(Migration):
    number = 12
    statements = [
        "ALTER TABLE messages ADD COLUMN target_agent_id INTEGER REFERENCES agents(id)",
        "CREATE INDEX messages_target_unread ON messages(environment_id, target_agent_id, type, read_at, delivered_at, id)",
        "DROP VIEW IF EXISTS chat_messages",
        f"CREATE VIEW chat_messages AS {CHAT_MESSAGES_SELECT}",
    ]
