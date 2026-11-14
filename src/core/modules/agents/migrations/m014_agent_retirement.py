from engine.database.migration import Migration


class AgentRetirementMigration(Migration):
    """Adds when, why and by whom an agent was retired to its row."""

    number = 14
    statements = ["ALTER TABLE agents ADD COLUMN retired_at TEXT",
                  "ALTER TABLE agents ADD COLUMN retirement_reason TEXT NOT NULL DEFAULT ''",
                  "ALTER TABLE agents ADD COLUMN retiring_actor_id INTEGER"]
