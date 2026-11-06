from core.base.database.migration import Migration


class HelperJobReviewPlanMigration(Migration):
    """Adds the plan an independent helper reviews on a job, so it gets no repeat review of that plan."""

    number = 35
    statements = ["ALTER TABLE helper_jobs ADD COLUMN review_plan_id INTEGER"]
