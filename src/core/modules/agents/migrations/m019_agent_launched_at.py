from core.base.database.migration import Migration


class AgentLaunchColumnMigration(Migration):
    """Adds the moment the launcher took an agent's program, from which a helper that sends no hook is judged."""

    number = 19
    statements = ["ALTER TABLE agents ADD COLUMN launched_at TEXT"]
