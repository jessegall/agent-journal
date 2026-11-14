from engine.database.migration import Migration


class AgentLaunchRowMigration(Migration):
    """A resumed agent keeps the number of the launch whose terminal it now runs in."""

    number = 2
    statements = ["ALTER TABLE agents ADD COLUMN launch_agent_id INTEGER"]
