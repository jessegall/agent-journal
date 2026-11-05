from core.base.database.migration import Migration


class FailureReasonIndexMigration(Migration):
    """Indexes refusal reasons for counts of earlier failed attempts."""

    number = 4
    statements = ["CREATE INDEX refusals_reason ON refusals (reason)"]
