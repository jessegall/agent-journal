from engine.database.migration import Migration


class OpenSuggestionIndexMigration(Migration):
    """Indexes the suggestions with no answer yet."""

    number = 2
    statements = ["CREATE INDEX suggestions_open ON suggestions (id) WHERE answer IS NULL"]
