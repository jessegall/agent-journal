from core.base.database.migration import Migration


class MessageRecipientMigration(Migration):
    """A message an agent sent to another agent names who it went to."""

    number = 9
    statements = ["ALTER TABLE messages ADD COLUMN recipient TEXT NOT NULL DEFAULT ''"]
