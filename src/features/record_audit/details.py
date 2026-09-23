from features.base import FeatureDetails, Line
from features.trigger import MINUTES, Trigger


class CleanupDetails(FeatureDetails):
    name = "record_audit"

    title = "Record audit"

    aliases = ("cleanup",)

    abstract = """
        Once a day you are told which rows in the record no longer hold: a file that is gone, a
        command that does not exist, a row waiting on the user too long
    """

    help = "Each finding names the row, what is wrong with it, and the command that retires it."

    trigger = Trigger(every=1440, unit=MINUTES)

    lines = [
        Line(
            name="evidence",
            title="{{count}} in the record have evidence against them",
            brief="{{found}}",
        ),
    ]
