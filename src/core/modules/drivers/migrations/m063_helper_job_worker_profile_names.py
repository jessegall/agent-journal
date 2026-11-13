from engine.database.migration import Migration


class HelperJobWorkerProfileNamesMigration(Migration):
    """Renames the profiles journal-medior and journal-senior to journal-worker-medior and journal-worker-senior on the helper jobs."""

    number = 63
    statements = [
        "UPDATE helper_jobs SET profile = CASE profile WHEN 'journal-medior' THEN 'journal-worker-medior' WHEN 'journal-senior' THEN 'journal-worker-senior' END WHERE profile IN ('journal-medior', 'journal-senior')",
    ]
