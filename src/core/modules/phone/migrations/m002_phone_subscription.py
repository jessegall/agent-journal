from core.base.database.migration import Migration


class PhoneSubscriptionMigration(Migration):
    """Adds the push subscription a paired phone gave, none until it gives one."""

    number = 2
    statements = (
        "ALTER TABLE phones ADD COLUMN subscription TEXT",
    )
