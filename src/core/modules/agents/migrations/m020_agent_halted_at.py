from engine.database.migration import Migration


class AgentHaltColumnMigration(Migration):
    """Adds the moment a hook of an agent was first stopped at its program's usage limit, empty once it went on."""

    number = 20
    statements = ["ALTER TABLE agents ADD COLUMN halted_at TEXT"]
