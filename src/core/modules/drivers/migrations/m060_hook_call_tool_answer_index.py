from engine.database.migration import Migration


class HookCallToolAnswerIndexMigration(Migration):
    """Indexes an agent's hooks by tool, hook and answer, so its newest allowed call of one tool, such as the
    Monitor a stop looks for, is found without walking every hook of the agent."""

    number = 60
    statements = ["CREATE INDEX hook_calls_agent_tool_answer ON hook_calls (session_agent_id, tool, hook, answer, id)"]
