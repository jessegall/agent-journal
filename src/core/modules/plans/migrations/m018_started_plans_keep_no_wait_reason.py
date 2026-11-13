from engine.database.migration import Migration


class StartedPlansKeepNoWaitReasonMigration(Migration):
    """Clears the reason a plan kept from a block after it was unblocked, so a started plan never reads as waiting."""

    number = 18
    statements = ["UPDATE plans SET reason = '', version = version + 1 WHERE state = 'started' AND reason != ''"]
