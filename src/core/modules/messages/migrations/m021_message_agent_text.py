from core.base.database.migration import Migration


class MessageAgentTextMigration(Migration):
    """Records whether a message is text copied from an agent's turn, not a reply the agent sent."""

    number = 21
    statements = ["ALTER TABLE messages ADD COLUMN is_agent_text INTEGER NOT NULL DEFAULT 0"]
