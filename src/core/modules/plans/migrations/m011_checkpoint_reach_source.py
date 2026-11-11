from engine.database.migration import Migration


class CheckpointReachSourceMigration(Migration):
    """Records where the work of each reached checkpoint stood when its run started; an early reach keeps that it
    was early."""

    number = 11
    statements = ("ALTER TABLE checkpoint_reaches ADD COLUMN source TEXT NOT NULL DEFAULT 'merged'",
                  "UPDATE checkpoint_reaches SET source = 'early' WHERE is_early = 1")
