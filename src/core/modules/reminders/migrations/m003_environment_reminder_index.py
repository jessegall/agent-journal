from core.base.database.migration import Migration


class EnvironmentReminderIndexMigration(Migration):
    """Indexes every reminder of an environment, in place of the index of the open ones only."""

    number = 3
    statements = ["DROP INDEX reminders_open_environment",
                  "CREATE INDEX reminders_environment ON reminders (environment_id, id)"]
