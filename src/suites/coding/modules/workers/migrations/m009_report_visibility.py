from engine.database.migration import Migration


class ReportVisibilityMigration(Migration):
    """Keeps existing reports private after message visibility becomes explicit."""

    number = 9
    statements = ["UPDATE messages SET is_chat_visible = 0 WHERE session_agent_id IN (SELECT id FROM agents WHERE role = 'worker')"]
