from core.base.database.migration import Migration


class ApprovalCommandsMigration(Migration):
    """Adds the command, kept as text, that Accept runs as the person."""

    number = 3
    statements = ["ALTER TABLE approvals ADD COLUMN command_json TEXT NOT NULL DEFAULT ''"]
