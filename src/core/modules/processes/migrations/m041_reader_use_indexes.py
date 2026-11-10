from engine.database.migration import Migration


class ReaderUseIndexesMigration(Migration):
    """Indexes the rows read together by their lookup fields."""

    number = 41
    statements = [
        'CREATE INDEX outputs_reader ON outputs (reader_id)',
        'CREATE INDEX reader_requests_reader ON reader_requests (reader_id)',
    ]
