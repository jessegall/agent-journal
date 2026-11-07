from core.base.database.migration import Migration


class DumpClosedIndexMigration(Migration):
    """Indexes dump closure times and supplies a narrow index for total counts."""

    number = 3
    statements = ["CREATE INDEX dumps_closed_at ON dumps (closed_at, id)"]
