from engine.database.migration import Migration


class WorkerProfileNamesMigration(Migration):
    """Renames the profiles journal-medior and journal-senior to journal-worker-medior and journal-worker-senior on the agents."""

    number = 27
    statements = [
        "UPDATE agents SET profile = CASE profile WHEN 'journal-medior' THEN 'journal-worker-medior' WHEN 'journal-senior' THEN 'journal-worker-senior' END WHERE profile IN ('journal-medior', 'journal-senior')",
    ]
