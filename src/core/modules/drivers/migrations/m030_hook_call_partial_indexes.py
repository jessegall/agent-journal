from core.base.database.migration import Migration


class HookCallPartialIndexesMigration(Migration):
    """Indexes refused hooks and hooks other than ticks by agent."""

    number = 30
    statements = [
        "CREATE INDEX hook_calls_refused ON hook_calls (session_agent_id, id) WHERE answer = 'refused'",
        "CREATE INDEX hook_calls_non_tick ON hook_calls (session_agent_id, id) WHERE hook <> 'tick'",
    ]
