from engine.database.migration import Migration


class HelperJobCostBaselineMigration(Migration):
    """Adds the cost the session had reported when a job began; a job from before has none, so its spend stays
    unknown."""

    number = 39
    statements = ["ALTER TABLE helper_jobs ADD COLUMN cost_baseline REAL"]
