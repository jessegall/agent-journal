from features.trigger import MINUTES
from features.base import FeatureDetails
from features.settings import Setting


class HousekeepingDetails(FeatureDetails):
    name = "housekeeping"

    title = "Housekeeping"

    abstract = """
        The runtime folder is kept small: terminal captures and logs are cut to their tail, and
        files of sessions gone quiet are removed
    """

    help = """
        Once an hour: each printed-<session> capture keeps its last 64 KB, each log its last
        1 MB; trigger, gate, seat, session and capture files untouched for housekeeping.days (7)
        are removed.
    """

    fixed = True

    trigger = {"every": 60, "unit": MINUTES}

    settings = [
        Setting(
            name="days",
            default=7,
            title="Remove a quiet session's files after",
            unit="days",
        ),
    ]
