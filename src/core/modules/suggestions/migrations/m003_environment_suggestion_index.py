from engine.database.migration import Migration


class EnvironmentSuggestionIndexMigration(Migration):
    """Indexes the suggestions of an environment."""

    number = 3
    statements = ["CREATE INDEX suggestions_environment ON suggestions (environment_id, id)"]
