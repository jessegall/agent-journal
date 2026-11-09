from core.base.database.migration import Migration


class SkipApprovalMigration(Migration):
    """Adds whether a confirmed skip of a helper waits for its main agent's approval, and when it
    was approved."""

    number = 44
    statements = ["ALTER TABLE refusal_skips ADD COLUMN waits_for_approval INTEGER NOT NULL DEFAULT 0",
                  "ALTER TABLE refusal_skips ADD COLUMN approved_at TEXT"]
