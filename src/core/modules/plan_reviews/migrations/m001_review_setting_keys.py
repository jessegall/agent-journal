from engine.database.migration import Migration


class ReviewSettingKeysMigration(Migration):
    """Moves the stored values of the checkpoint review settings to the keys of the module that now owns them."""

    number = 1
    statements = [
        "UPDATE settings SET key = 'journal.core.plan_reviews.checkpoints.quick-review' WHERE key = 'journal.core.plans.checkpoints.quick-review'",
        "UPDATE settings SET key = 'journal.core.plan_reviews.checkpoints.review-model' WHERE key = 'journal.core.plans.checkpoints.review-model'",
    ]
