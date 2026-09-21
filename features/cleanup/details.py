from features.base import FeatureDetails, Line
from features.trigger import MINUTES


class CleanupDetails(FeatureDetails):
    name = "cleanup"

    title = "The record audit"

    abstract = """
        What in the record has evidence against it — a file that is gone, a command that does
        not exist, a row waiting on the user too long — said to the agent once a day
    """

    help = "Each finding names the row, what is wrong with it, and the command that retires it."

    trigger = {"every": 1440, "unit": MINUTES}

    lines = [
        Line(
            name="evidence",
            title="{{count}} in the record have evidence against them",
            brief="{{found}}",
        ),
    ]
