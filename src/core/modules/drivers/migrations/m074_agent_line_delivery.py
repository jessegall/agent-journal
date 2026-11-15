from engine.database.migration import Migration


class AgentLineDeliveryMigration(Migration):
    """Lets a line say whether it is typed into its agent's terminal or given to its program's wake hook."""

    number = 74
    statements = ["ALTER TABLE agent_lines ADD COLUMN delivery TEXT NOT NULL DEFAULT 'terminal_typing'"]
