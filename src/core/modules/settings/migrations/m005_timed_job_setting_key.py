from engine.database.migration import Migration


class TimedJobSettingKeyMigration(Migration):
    """The setting of how many timed jobs run at once takes its plain key."""

    number = 5
    statements = ["UPDATE settings SET key = replace(key, '.tick-workers', '.parallel-timed-jobs') WHERE key LIKE '%.tick-workers'"]
