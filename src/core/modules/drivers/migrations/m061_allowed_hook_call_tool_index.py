from engine.database.migration import Migration


class AllowedHookCallToolIndexMigration(Migration):
    """Narrows the index of an agent's hooks by tool and hook to its allowed calls, the newest of which a stop looks
    for, so a read of another answer, such as the newest refused hook, keeps its own index."""

    number = 61
    statements = ["DROP INDEX IF EXISTS hook_calls_agent_tool_answer",
                  "CREATE INDEX hook_calls_allowed_agent_tool ON hook_calls (session_agent_id, tool, hook, id) WHERE answer = 'allowed'"]
