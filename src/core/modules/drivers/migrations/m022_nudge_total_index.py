from engine.database.migration import Migration


class NudgeTotalIndexMigration(Migration):
    """Indexes the rows read together by their lookup fields."""

    number = 22
    statements = [
        'CREATE INDEX nudge_records_key_delivery ON nudge_records (key, delivery_count, last_delivered_at)',
    ]
