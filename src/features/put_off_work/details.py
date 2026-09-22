from features.trigger import IDLE, Trigger
from features.base import FeatureDetails, Line


class DeferralDetails(FeatureDetails):
    name = "put_off_work"

    title = "Catch put-off work"

    aliases = ("deferral",)

    abstract = "Work put off in words, with no to-do parked, is named back to the agent once"

    help = """
        A sentence like 'I'll do that after this' is the title of a to-do; file it immediately
        before the reply or next implementation.
    """

    trigger = Trigger(on=IDLE)

    lines = [
        Line(
            name="deferred",
            title="work deferred in words, not parked",
            brief='"{{words}}" is the title of a to-do: journal todo create "<title>" --brief, then say so',
        ),
    ]
