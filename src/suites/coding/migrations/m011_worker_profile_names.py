from engine.database.migration import Migration

RENAMES = (("journal-medior", "journal-worker-medior"), ("journal-senior", "journal-worker-senior"))


class WorkerProfileNamesMigration(Migration):
    """Renames the coding suite's profiles journal-medior and journal-senior to journal-worker-medior and
    journal-worker-senior wherever the journal keeps a profile name: agents, helper jobs, settings and use
    counts."""

    number = 11
    statements = [*(f"UPDATE {table} SET profile = '{new}' WHERE profile = '{old}'" for table in ("agents", "helper_jobs") for old, new in RENAMES),
                  *(f"UPDATE settings SET value = replace(value, '{old}', '{new}') WHERE value LIKE '%{old}%'" for old, new in RENAMES),
                  *(f"UPDATE statistics SET key = 'profiles.{new}.' || substr(key, length('profiles.{old}.') + 1) WHERE key LIKE 'profiles.{old}.%'" for old, new in RENAMES)]
