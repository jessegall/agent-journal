from engine.database.migration import Migration


class HookCallTimeIndexesMigration(Migration):
    """An agent's hook calls since a time are counted through indexes, as the write and tool counts and the
    idle check run at hooks."""

    number = 13
    statements = (
        "CREATE INDEX hook_calls_agent_hook_created ON hook_calls (agent_id, hook, created_at)",
        "CREATE INDEX hook_calls_agent_created ON hook_calls (agent_id, created_at)",
    )
