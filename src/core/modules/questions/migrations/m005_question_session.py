from core.base.database.migration import Migration


class QuestionSessionMigration(Migration):
    """Names the column that holds the agent of the session a row belongs to."""

    number = 5
    statements = ["ALTER TABLE questions RENAME COLUMN agent_id TO session_agent_id"]
