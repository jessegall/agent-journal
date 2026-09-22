from features.trigger import MINUTES, Trigger
from features.base import FeatureDetails
from features.settings import Setting


class HousekeepingDetails(FeatureDetails):
    name = "runtime_cleanup"

    title = "Runtime cleanup"

    aliases = ("housekeeping",)

    abstract = """
        The runtime folder is kept small: terminal captures and logs are cut to their tail, and
        files of sessions gone quiet are removed
    """

    help = """
        Once an hour: each session keeps its files in runtime/sessions/<session>; its printed
        capture keeps its last 64 KB and every log its last 1 MB, and a session's folder untouched
        for housekeeping.days (2) is removed whole.
    """

    fixed = True

    trigger = Trigger(every=60, unit=MINUTES)

    settings = [
        Setting(
            name="days",
            default=2,
            title="Remove a quiet session's files after",
            unit="days",
        ),
    ]
