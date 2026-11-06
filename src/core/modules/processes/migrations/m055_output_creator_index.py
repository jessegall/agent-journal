from core.base.database.migration import Migration


class OutputCreatorIndexMigration(Migration):
    """Indexes outputs by their creator."""

    number = 55
    statements = ["CREATE INDEX outputs_creator ON outputs (creator_id)"]
