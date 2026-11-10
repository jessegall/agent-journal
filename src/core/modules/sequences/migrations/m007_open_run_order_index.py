from engine.database.migration import Migration


class OpenRunOrderIndexMigration(Migration):
    """Indexes the rows read together by their lookup fields."""

    number = 7
    statements = [
        'CREATE INDEX sequence_runs_open_id ON sequence_runs (id) WHERE ended_at IS NULL',
    ]
