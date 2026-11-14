from engine.database.migration import Migration


class MenuAnswerSessionMigration(Migration):
    """Names the column that holds the agent of the session a row belongs to."""

    number = 10
    statements = ["ALTER TABLE menu_answers RENAME COLUMN agent_id TO session_agent_id"]
