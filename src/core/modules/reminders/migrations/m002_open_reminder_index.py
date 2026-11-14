from engine.database.migration import Migration


class OpenReminderIndexMigration(Migration):
    """Indexes active reminders within each environment."""

    number = 2
    statements = ["CREATE INDEX reminders_open_environment ON reminders (environment_id, id) WHERE ended_at IS NULL"]
