from core.base.database.migration import Migration


class QuestionEnvironmentStateIndexMigration(Migration):
    """Indexes questions in each state, of one environment and of all of them."""

    number = 6
    statements = ["CREATE INDEX questions_environment_state ON questions (environment_id, state, id)", "CREATE INDEX questions_state ON questions (state, id)"]
