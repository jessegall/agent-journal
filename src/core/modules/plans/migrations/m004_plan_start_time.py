from engine.database.migration import Migration


class PlanStartTimeMigration(Migration):
    """A plan keeps when it was started; a plan started before this takes its last update as that time."""

    number = 4
    statements = ["ALTER TABLE plans ADD COLUMN started_at TEXT", "UPDATE plans SET started_at = updated_at WHERE state IN ('started', 'blocked')"]
