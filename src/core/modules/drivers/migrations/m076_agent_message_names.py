from engine.database.migration import Migration


class AgentMessageNamesMigration(Migration):
    """Names the lines the journal gives an agent agent messages in the stored columns too: the record of each
    message, the block's message key and text and the line's message."""

    number = 76
    statements = [
        "ALTER TABLE nudge_records RENAME TO agent_message_records",
        "ALTER TABLE agent_blocks RENAME COLUMN nudge_key TO agent_message_key",
        "ALTER TABLE agent_blocks RENAME COLUMN nudge_text TO agent_message_text",
        "ALTER TABLE agent_lines RENAME COLUMN nudge_json TO agent_message_json",
    ]
