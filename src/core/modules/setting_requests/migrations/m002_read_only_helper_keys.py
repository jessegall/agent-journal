from core.base.database.migration import Migration

MOVED_KEYS = [("journal.core.helpers.helper-run-limit", "journal.core.helpers.read-only-helper-run-limit"),
              ("journal.core.helpers.helper-kept-limit", "journal.core.helpers.read-only-helper-kept-limit"),
              ("journal.core.helpers.helper-profile-limits", "journal.core.helpers.read-only-helper-profile-limits"),
              ("journal.core.helpers.helper-max-minutes", "journal.core.helpers.read-only-helper-max-minutes"),
              ("journal.core.helpers.helper-max-cost", "journal.core.helpers.read-only-helper-max-cost"),
              ("journal.core.helpers.helper-instruction-files", "journal.core.helpers.read-only-helper-instruction-files")]


class HelperKeysMigration(Migration):
    """Requests for the settings renamed for read-only helpers keep their setting."""

    number = 2
    statements = [f"UPDATE setting_requests SET key = '{new}' WHERE key = '{old}'" for old, new in MOVED_KEYS]
