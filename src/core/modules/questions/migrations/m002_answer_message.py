from core.base.database.migration import Migration


class AnswerMessageMigration(Migration):
    """Adds the message that answered a question."""

    number = 2
    statements = (
        "ALTER TABLE questions ADD COLUMN message_id INTEGER REFERENCES messages(id) ON DELETE RESTRICT",
    )
