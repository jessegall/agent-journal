from engine.database.migration import Migration


class HookTimeoutNoticeAgentIndexMigration(Migration):
    """Indexes the hook timeout notice rows of an agent, newest first."""

    number = 52
    statements = ["CREATE INDEX hook_timeout_notices_agent ON hook_timeout_notices (session_agent_id, id)"]
