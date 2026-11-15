from engine.database.migration import Migration


class HelperJobHandoverMigration(Migration):
    """Gives a helper job the four columns of its handover (doc 1310 section 4.9): where it stands, where its text came
    from, how often its save failed, and the text kept when it could not be saved."""

    number = 67
    statements = ["ALTER TABLE helper_jobs ADD COLUMN handover_state TEXT NOT NULL DEFAULT 'pending'",
                  "ALTER TABLE helper_jobs ADD COLUMN handover_source TEXT NOT NULL DEFAULT ''",
                  "ALTER TABLE helper_jobs ADD COLUMN handover_failures INTEGER NOT NULL DEFAULT 0",
                  "ALTER TABLE helper_jobs ADD COLUMN failed_text TEXT NOT NULL DEFAULT ''"]
