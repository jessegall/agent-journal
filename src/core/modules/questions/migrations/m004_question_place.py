from core.base.database.migration import Migration


class QuestionPlaceMigration(Migration):
    """Stores a question's document or report and selected text."""

    number = 4
    statements = [
        "ALTER TABLE questions ADD COLUMN row_model TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE questions ADD COLUMN row_id INTEGER",
        "ALTER TABLE questions ADD COLUMN quote TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE questions ADD COLUMN position INTEGER",
        "ALTER TABLE questions ADD COLUMN selection_type TEXT NOT NULL DEFAULT 'text'",
        "CREATE INDEX questions_row ON questions (row_model, row_id, id)",
    ]
