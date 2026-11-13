from engine.database.migration import Migration


class AgentAnnouncedColumnMigration(Migration):
    """Adds the moment an agent session announced itself with its first hook, empty for a session the launcher
    starts."""

    number = 26
    statements = ["ALTER TABLE agents ADD COLUMN announced_at TEXT"]
