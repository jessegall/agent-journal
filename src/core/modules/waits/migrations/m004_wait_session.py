from engine.database.migration import Migration


class WaitSessionMigration(Migration):
    """Names the column that holds the agent of the session a row belongs to."""

    number = 4
    statements = ["ALTER TABLE waits RENAME COLUMN agent_id TO session_agent_id"]
