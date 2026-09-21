from features.trigger import MINUTES, PERCENT, Trigger
from features.base import Behaviour, FeatureDetails, Line


class ContextDetails(FeatureDetails):
    name = "memory_checkpoints"

    title = "Memory checkpoints"

    aliases = ("context",)

    abstract = """
        At each mark of the context window the agent decides — fact, rule or nothing — before
        any other write; and every week it reads every rule and fact again
    """

    help = """
        The marks are the trigger's at list; a fact, a rule, or journal nothing "<why>" releases
        the hold.

        journal rule reread prints every standing rule and fact in full and marks the reading
        done; it is owed again a week later.
    """

    trigger = Trigger(at=(50, 70, 90, 95), unit=PERCENT)

    behaviours = [
        Behaviour(
            name="rereading",
            title="Read every rule and fact again each week",
            abstract="Named once a day while the reading is owed",
            trigger=Trigger(every=1440, unit=MINUTES),
        ),
    ]

    lines = [
        Line(
            name="decide",
            title="context {{percent}}% full, decide",
            brief='a fact is what a later reader would get wrong without, a rule binds every environment, or nothing "<why>"',
        ),
        Line(
            name="decide held",
            title='context {{percent}}% full — decide before any other write — journal fact, journal rule, or journal nothing "<why>"',
        ),
        Line(
            name="reread",
            title="the reading pass over every rule and fact is owed",
            brief="journal rule reread",
        ),
    ]
