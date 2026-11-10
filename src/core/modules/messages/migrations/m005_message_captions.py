from engine.database.migration import Migration


class MessageCaptionsMigration(Migration):
    """A message keeps what the agent said each attached file shows."""

    number = 5
    statements = ["ALTER TABLE messages ADD COLUMN captions TEXT NOT NULL DEFAULT '{}'"]
