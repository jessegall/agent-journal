from engine.database.migration import Migration


class ApprovalFailureMigration(Migration):
    """Adds the reason an accepted approval's action failed, empty for any other approval."""

    number = 7
    statements = ["ALTER TABLE approvals ADD COLUMN failure TEXT NOT NULL DEFAULT ''"]
