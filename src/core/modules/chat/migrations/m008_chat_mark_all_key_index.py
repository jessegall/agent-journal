from engine.database.migration import Migration


class ChatMarkAnyEnvironmentKeyIndexMigration(Migration):
    """Indexes chat marks by key, for reads across all environments."""

    number = 8
    statements = ["CREATE INDEX chat_marks_any_key ON chat_marks (key)"]
