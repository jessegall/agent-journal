from engine.database.migration import Migration


class ClearedOldInterruptsMigration(Migration):
    """An agent's interrupt older than its newest prompt is cleared, as that prompt clears it from now on."""

    number = 84
    statements = ["UPDATE agents SET interrupted_at = NULL WHERE interrupted_at IS NOT NULL AND interrupted_at <"
                  " (SELECT max(created_at) FROM hook_calls WHERE hook_calls.session_agent_id = agents.id AND hook_calls.hook = 'prompt')"]
