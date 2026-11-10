from engine.database.migration import Migration


class VisibleMessageIndexMigration(Migration):
    """Indexes the rows read together by their lookup fields."""

    number = 13
    statements = [
        'CREATE INDEX messages_chat_visible_id ON messages (id) WHERE is_chat_visible = 1',
    ]
