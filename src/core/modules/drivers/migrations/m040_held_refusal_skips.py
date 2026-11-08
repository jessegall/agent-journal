from core.base.database.migration import Migration


class HeldRefusalSkipsMigration(Migration):
    """Adds the answer to a held skip: when the agent confirmed it and what it tried instead, or when it withdrew it.
    Skips from before count as confirmed."""

    number = 40
    statements = ["ALTER TABLE refusal_skips ADD COLUMN confirmed_at TEXT",
                  "ALTER TABLE refusal_skips ADD COLUMN withdrawn_at TEXT",
                  "ALTER TABLE refusal_skips ADD COLUMN tried TEXT NOT NULL DEFAULT ''",
                  "UPDATE refusal_skips SET confirmed_at = created_at"]
