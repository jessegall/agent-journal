from engine.database.migration import Migration


class AgentParentIndexMigration(Migration):
    """Indexes the rows read together by their lookup fields."""

    number = 8
    statements = [
        'CREATE INDEX agents_parent ON agents (parent_id)',
    ]
