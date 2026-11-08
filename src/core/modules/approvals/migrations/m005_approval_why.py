from core.base.database.migration import Migration


class ApprovalWhyMigration(Migration):
    """Adds the reason the requester gave for an approval, shown under its question."""

    number = 5
    statements = ["ALTER TABLE approvals ADD COLUMN why TEXT NOT NULL DEFAULT ''"]
