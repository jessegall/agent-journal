from features.trigger import IDLE, Trigger
from features.base import FeatureDetails, Line
from features.groups import Group


class PutOffWorkDetails(FeatureDetails):
    name = "put_off_work"
    group = Group.WORK_TRACKING
    label = "Catch work put off for later"
    hint = "Tells the agent once when it says “later” without filing a to-do"
    has_skill = False

    title = "Catch work put off for later"

    aliases = ("deferral",)

    abstract = "When the agent says it will do something later without filing a to-do, it is told once."

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
