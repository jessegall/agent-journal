from engine.database.migration import Migration


class ReviewStateIndexMigration(Migration):
    """Indexes the rows read together by their lookup fields."""

    number = 5
    statements = [
        'CREATE INDEX reviews_state ON reviews (state)',
    ]
