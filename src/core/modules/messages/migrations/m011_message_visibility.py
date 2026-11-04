from core.base.database.migration import Migration


class MessageVisibilityMigration(Migration):
    """Records whether a message belongs in the shared chat."""

    number = 11
    statements = ["ALTER TABLE messages ADD COLUMN is_chat_visible INTEGER NOT NULL DEFAULT 1"]
