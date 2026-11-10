from engine.database.migration import Migration


class OutputCreatorIndexMigration(Migration):
    """Indexes outputs by their creator."""

    number = 56
    statements = ["CREATE INDEX outputs_creator ON outputs (creator_id)"]
