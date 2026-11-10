from engine.database.migration import Migration


class SequenceTriggersMigration(Migration):
    """A sequence keeps what starts it on its own and what each step holds back."""

    number = 2
    statements = ("ALTER TABLE sequences ADD COLUMN triggers TEXT NOT NULL DEFAULT '[]'", "ALTER TABLE sequences ADD COLUMN step_guards TEXT NOT NULL DEFAULT '[]'")
