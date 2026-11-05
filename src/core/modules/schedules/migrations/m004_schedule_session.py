from core.base.database.migration import Migration


class ScheduleSessionMigration(Migration):
    """Names the column that holds the agent of the session a row belongs to."""

    number = 4
    statements = ["ALTER TABLE scheduled_jobs RENAME COLUMN agent_id TO session_agent_id"]
