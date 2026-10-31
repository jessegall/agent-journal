from core.base.database.migration import Migration


class PausedPlansBlocked(Migration):
    """Turns every paused plan into a blocked one, since plans have no paused state."""

    number = 2
    statements = (
        "UPDATE plans SET state = 'blocked' WHERE state = 'paused'",
    )
