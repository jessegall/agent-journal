from engine.database.migration import Migration


class MessagePeerMigration(Migration):
    """A message from another agent session names that session, and a key so it is kept once."""

    number = 8
    statements = ["ALTER TABLE messages ADD COLUMN peer TEXT NOT NULL DEFAULT ''",
                  "ALTER TABLE messages ADD COLUMN peer_key TEXT NOT NULL DEFAULT ''"]
