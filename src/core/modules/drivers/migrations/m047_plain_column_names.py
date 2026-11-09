from core.base.database.migration import Migration


class PlainColumnNamesMigration(Migration):
    """Renames the columns whose names were not plain words."""

    number = 47
    statements = ["ALTER TABLE permission_requests RENAME COLUMN answered_by_id TO responder_id",
                  "ALTER TABLE refusal_skips RENAME COLUMN withdrawn_at TO cancelled_at",
                  "ALTER TABLE refusal_skips RENAME COLUMN waits_for_approval TO needs_approval"]
