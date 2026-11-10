from engine.database.migration import Migration


class SequenceSessionMigration(Migration):
    """Names the column that holds the agent of the session a row belongs to."""

    number = 8
    statements = ["ALTER TABLE sequence_runs RENAME COLUMN agent_id TO session_agent_id"]
