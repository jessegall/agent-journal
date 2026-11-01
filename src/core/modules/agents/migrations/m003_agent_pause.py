from core.base.database.migration import Migration


class AgentPauseMigration(Migration):
    """An agent keeps when a person paused it, until they resume it."""

    number = 3
    statements = ["ALTER TABLE agents ADD COLUMN paused_at TEXT"]
