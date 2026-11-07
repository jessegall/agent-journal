from core.base.database.migration import Migration


class ReviewerEnvironmentIndexMigration(Migration):
    """Indexes reviewer availability within each environment."""

    number = 4
    statements = ["CREATE INDEX reviewers_environment_state ON reviewers (environment_id, state)"]
