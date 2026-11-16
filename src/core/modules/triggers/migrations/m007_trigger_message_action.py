from engine.database.migration import Migration


class TriggerMessageActionMigration(Migration):
    """A trigger that gives the agent a line has the action agent-message; the action's check is dropped first,
    and the sync after the migrations writes it again with the new action."""

    number = 7
    statements = ["DROP TRIGGER IF EXISTS triggers_rule_action_insert", "DROP TRIGGER IF EXISTS triggers_rule_action_update",
                  "UPDATE triggers SET action = 'agent-message' WHERE action = 'nudge'"]
