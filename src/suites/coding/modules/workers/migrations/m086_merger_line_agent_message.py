from engine.database.migration import Migration


class MergerLineAgentMessageMigration(Migration):
    """Names the merger line's stored message an agent message, as the agent lines name theirs."""

    number = 86
    statements = ["ALTER TABLE merger_lines RENAME COLUMN nudge_json TO agent_message_json"]
