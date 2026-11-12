from engine.database.migration import Migration

OLD_PREFIX = "journal.core.tools."
NEW_PREFIX = "journal.suites.coding."
KEYS = ("graphify", "graphify.nudge-after", "graphify.block-after", "graphify-command", "graphify-install-command")


class GraphifySettingKeysMigration(Migration):
    """Moves Graphify's settings from the tools module to the coding suite, which declares them now."""

    number = 10
    statements = [f"UPDATE settings SET key = '{NEW_PREFIX}{key}' WHERE key = '{OLD_PREFIX}{key}'" for key in KEYS]
