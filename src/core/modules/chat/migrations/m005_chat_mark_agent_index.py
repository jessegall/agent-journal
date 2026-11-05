from core.base.database.migration import Migration


class ChatMarkAgentIndexMigration(Migration):
    """Indexes the rows read together by their lookup fields."""

    number = 5
    statements = [
        'CREATE INDEX chat_marks_agent ON chat_marks (agent_id)',
    ]
