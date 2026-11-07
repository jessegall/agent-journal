from core.base.database.migration import Migration


class HelperLimitKeyMigration(Migration):
    """Moves the helper limit to the helper run limit, which keeps its value at each level."""

    number = 1
    statements = ["DELETE FROM settings WHERE key = 'journal.core.helpers.helper-limit'"
                  " AND EXISTS (SELECT 1 FROM settings AS newer WHERE newer.key = 'journal.core.helpers.helper-run-limit'"
                  " AND newer.environment_id IS settings.environment_id)",
                  "UPDATE settings SET key = 'journal.core.helpers.helper-run-limit' WHERE key = 'journal.core.helpers.helper-limit'"]
