from engine.database.migration import Migration


class WorkerProfileUseNamesMigration(Migration):
    """Renames the use counts of the profiles journal-medior and journal-senior to journal-worker-medior and journal-worker-senior."""

    number = 2
    statements = [
        "UPDATE statistics SET key = 'profiles.journal-worker-medior.' || substr(key, length('profiles.journal-medior.') + 1) WHERE key LIKE 'profiles.journal-medior.%'",
        "UPDATE statistics SET key = 'profiles.journal-worker-senior.' || substr(key, length('profiles.journal-senior.') + 1) WHERE key LIKE 'profiles.journal-senior.%'",
    ]
