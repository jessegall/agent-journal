from core.base.database.migration import Migration


class MainMessageTargetsMigration(Migration):
    """Clears a target that is a main agent: a message with no target is for the main agent of its environment."""

    number = 15
    statements = ["UPDATE messages SET target_agent_id = NULL WHERE target_agent_id IN (SELECT id FROM agents WHERE role = 'main')"]
