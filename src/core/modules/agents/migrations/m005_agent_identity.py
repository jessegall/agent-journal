from engine.database.migration import Migration


class AgentIdentityMigration(Migration):
    """An agent knows the model it was started on and the profile and given name its card shows."""

    number = 5
    statements = ["ALTER TABLE agents ADD COLUMN program_model TEXT NOT NULL DEFAULT ''", "ALTER TABLE agents ADD COLUMN profile TEXT NOT NULL DEFAULT ''", "ALTER TABLE agents ADD COLUMN given_name TEXT NOT NULL DEFAULT ''"]
