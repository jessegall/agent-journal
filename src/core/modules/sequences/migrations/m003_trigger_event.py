from core.base.database.migration import Migration


class TriggerEventMigration(Migration):
    """A row trigger names its event under event, not moment."""

    number = 3
    statements = ["""UPDATE sequences SET triggers = replace(triggers, '"moment"', '"event"')"""]
