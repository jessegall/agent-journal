from engine.database.migration import Migration


class NudgeRecordDeliveryMigration(Migration):
    """Names a nudge record's counts for what they hold: how often a line was delivered, and when last."""

    number = 7
    statements = ("ALTER TABLE nudge_records RENAME COLUMN said_count TO delivery_count",
                  "ALTER TABLE nudge_records RENAME COLUMN last_said_at TO last_delivered_at")
