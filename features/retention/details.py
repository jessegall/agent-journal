from features import trigger
from features.base import FeatureDetails


class RetentionDetails(FeatureDetails):
    name = "retention"

    title = "Retention"

    abstract = """
        Reports age out, finished to-dos are archived and notifications the user has seen are
        removed, after their keep days, once an hour
    """

    help = "keep.report, keep.todo and keep.notification are days per environment; 0 keeps everything listed."

    trigger = {"every": 60, "unit": trigger.MINUTES}
