from engine.database.migration import Migration


class MessageFilesMigration(Migration):
    """Gives each message the names of the files that were sent with it."""

    number = 2
    statements = tuple(["ALTER TABLE messages ADD COLUMN files TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(files))"])
