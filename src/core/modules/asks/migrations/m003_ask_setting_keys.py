from engine.database.migration import Migration

MOVED_KEYS = ("ask-answer-minutes", "ask-pass-on-minutes", "ask-visits-limit")


class AskSettingKeysMigration(Migration):
    """Moves the stored question settings from the coding suite's workers module to the asks module; where both keys
    are stored for one environment, the new one is kept."""

    number = 3
    statements = [statement for name in MOVED_KEYS for statement in (
        f"DELETE FROM settings WHERE key = 'journal.suites.coding.workers.{name}'"
        f" AND EXISTS (SELECT 1 FROM settings AS newer WHERE newer.key = 'journal.core.asks.{name}' AND newer.environment_id IS settings.environment_id)",
        f"UPDATE settings SET key = 'journal.core.asks.{name}' WHERE key = 'journal.suites.coding.workers.{name}'",
    )]
