from engine.database.migration import Migration


class TaskFocusTimeMigration(Migration):
    """Keeps when an agent said it works on a started task now."""

    number = 24
    statements = ["ALTER TABLE tasks ADD COLUMN focused_at TEXT"]
