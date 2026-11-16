from engine.database.migration import Migration


class DropAgentLineDeliveryMigration(Migration):
    """Every line for an agent is typed into its terminal once it stops, so a line no longer says how it is
    delivered; the checks of the column go before it."""

    number = 79
    statements = ["DROP TRIGGER IF EXISTS agent_lines_rule_delivery_insert", "DROP TRIGGER IF EXISTS agent_lines_rule_delivery_update",
                  "ALTER TABLE agent_lines DROP COLUMN delivery"]
