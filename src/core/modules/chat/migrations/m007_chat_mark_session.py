from core.base.database.migration import Migration


class ChatMarkSessionMigration(Migration):
    """Names the column that holds the agent of the session a row belongs to."""

    number = 7
    statements = ["ALTER TABLE chat_marks RENAME COLUMN agent_id TO session_agent_id"]
