from core.base.database.migration import Migration


class MessageReactionsMigration(Migration):
    """A message keeps the faces people and agents put on it."""

    number = 6
    statements = ["ALTER TABLE messages ADD COLUMN reactions TEXT NOT NULL DEFAULT '[]'"]
