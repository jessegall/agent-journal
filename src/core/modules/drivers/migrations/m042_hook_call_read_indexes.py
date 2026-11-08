from core.base.database.migration import Migration


class HookCallReadIndexesMigration(Migration):
    """Indexes an agent's hooks by name and its tool calls by tool and file, so the repeated read notice finds the
    agent's last compaction and its last read of a file without walking all its hooks."""

    number = 42
    statements = [
        "CREATE INDEX hook_calls_session_hook ON hook_calls (session_agent_id, hook, id)",
        "CREATE INDEX hook_calls_session_tool ON hook_calls (session_agent_id, tool, summary, id)",
    ]
