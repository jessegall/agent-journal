from engine.database.migration import Migration


class TriggerMessageActionMigration(Migration):
    """A trigger that gives the agent a line has the action agent-message."""

    number = 7
    statements = ["UPDATE triggers SET action = 'agent-message' WHERE action = 'nudge'"]
