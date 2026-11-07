from core.base.database.migration import Migration


class MessageSessionMigration(Migration):
    """Names the column that holds the agent of the session a row belongs to."""

    number = 16
    statements = ["ALTER TABLE messages RENAME COLUMN agent_id TO session_agent_id"]
