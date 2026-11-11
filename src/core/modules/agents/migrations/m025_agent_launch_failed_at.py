from engine.database.migration import Migration


class AgentLaunchFailureColumnMigration(Migration):
    """Adds the moment the launcher last could not start an agent's program, empty once a program of it started."""

    number = 25
    statements = ["ALTER TABLE agents ADD COLUMN launch_failed_at TEXT"]
