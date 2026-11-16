from engine.database.migration import Migration


class DropAgentLineDeliveryMigration(Migration):
    """Every line for an agent is typed into its terminal once it stops, so a line no longer says how it is
    delivered."""

    number = 79
    statements = ["ALTER TABLE agent_lines DROP COLUMN delivery"]
