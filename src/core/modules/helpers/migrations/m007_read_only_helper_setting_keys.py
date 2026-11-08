from core.base.database.migration import Migration

KEYS = ["run-limit", "kept-limit", "profile-limits", "max-minutes", "max-cost", "instruction-files"]


class ReadOnlyHelperSettingKeysMigration(Migration):
    """These settings hold for read-only helpers alone, so their keys now say so; stored values keep their level."""

    number = 7
    statements = [f"UPDATE settings SET key = 'journal.core.helpers.read-only-helper-{key}' WHERE key = 'journal.core.helpers.helper-{key}'" for key in KEYS]
