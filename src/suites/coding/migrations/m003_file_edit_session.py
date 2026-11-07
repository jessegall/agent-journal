from core.base.database.migration import Migration


class FileEditSessionMigration(Migration):
    """Names the column that holds the agent of the session a row belongs to."""

    number = 3
    statements = ["ALTER TABLE file_edits RENAME COLUMN agent_id TO session_agent_id"]
