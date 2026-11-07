from core.base.database.migration import Migration


class ChatMarkKeyIndexMigration(Migration):
    """A mark is found by its key through an index, as each process event looks its mark up."""

    number = 3
    statements = tuple(["CREATE INDEX chat_marks_key ON chat_marks (environment_id, key)"])
