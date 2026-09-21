from features.trigger import IDLE
from features.base import FeatureDetails, Line


class DeferralDetails(FeatureDetails):
    name = "deferral"

    title = "Catching work put off"

    abstract = "Work put off in words, with no to-do parked, is named back to the agent once"

    help = """
        A sentence like 'I'll do that after this' is the title of a to-do; file it immediately
        before the reply or next implementation.
    """

    trigger = {"on": IDLE}

    lines = [
        Line(
            name="deferred",
            title="work deferred in words, not parked",
            brief='"{{words}}" is the title of a to-do: journal todo create "<title>" --brief, then say so',
        ),
    ]
