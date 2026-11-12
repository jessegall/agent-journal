from engine.database.migration import Migration


class WorkerProfileNamesInSettingsMigration(Migration):
    """Renames the profiles journal-medior and journal-senior to journal-worker-medior and journal-worker-senior in the settings that list profiles."""

    number = 10
    statements = [
        "UPDATE settings SET value = replace(replace(value, 'journal-medior', 'journal-worker-medior'), 'journal-senior', 'journal-worker-senior')"
        " WHERE value LIKE '%journal-medior%' OR value LIKE '%journal-senior%'",
    ]
