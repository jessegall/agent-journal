from core.base.database.migration import Migration


class HookCallHookIndexMigration(Migration):
    """An agent's hook calls of one hook are found through an index, as stops and compactions are looked up
    often."""

    number = 3
    statements = tuple(["CREATE INDEX hook_calls_agent_hook ON hook_calls (agent_id, hook, id)"])
