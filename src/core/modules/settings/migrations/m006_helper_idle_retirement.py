from engine.database.migration import Migration

PROFILE_LIMITS = "journal.core.helpers.read-only-helper-profile-limits"
RUN_PART = "substr(each.value, instr(each.value, ':') + 1)"


class HelperIdleRetirementMigration(Migration):
    """Read-only helpers have no kept limit any more, since an unused one is retired after its idle hours: the stored
    kept limit goes, and each entry of a profile's helper limits keeps its profile and run limit."""

    number = 6
    statements = ["DELETE FROM settings WHERE key = 'journal.core.helpers.read-only-helper-kept-limit'",
                  f"UPDATE settings SET value = (SELECT json_group_array(substr(each.value, 1, instr(each.value, ':')) || substr({RUN_PART}, 1, instr({RUN_PART} || ':', ':') - 1))"
                  f" FROM json_each(settings.value) AS each) WHERE key = '{PROFILE_LIMITS}' AND json_valid(value) AND json_type(value) = 'array'"]
