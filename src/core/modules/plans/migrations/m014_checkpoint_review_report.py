from engine.database.migration import Migration


class CheckpointReviewReportMigration(Migration):
    """Adds the report a checkpoint's reviewer returned, empty until the reviewer has reported."""

    number = 14
    statements = [
        "ALTER TABLE checkpoint_reviews ADD COLUMN report TEXT NOT NULL DEFAULT ''",
    ]
