from features.trigger import IDLE, Trigger
from features.base import FeatureDetails, Line


class DeferralDetails(FeatureDetails):
    name = "put_off_work"

    title = "Catch put-off work"

    aliases = ("deferral",)

    abstract = "If you say you will do something later without filing a to-do for it, you are told once"

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
