from core.base.database.migration import Migration


class ReaderSampleIndexMigration(Migration):
    """Indexes reader requests by their sample process."""

    number = 40
    statements = ["CREATE INDEX reader_requests_sample_process ON reader_requests (sample_process_id)"]
