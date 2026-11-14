from engine.database.migration import Migration


class QuestionContextMigration(Migration):
    """Stores the few sentences that let a question be read on its own."""

    number = 7
    statements = ["ALTER TABLE questions ADD COLUMN context TEXT NOT NULL DEFAULT ''"]
