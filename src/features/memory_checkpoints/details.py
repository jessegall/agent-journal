from features.trigger import MINUTES, PERCENT, Trigger
from features.base import Behaviour, FeatureDetails, Line
from features.groups import Group


class MemoryCheckpointsDetails(FeatureDetails):
    explains = 'As the conversation fills, the journal asks the agent what should be remembered. You can review the facts and rules it saves.'
    name = "memory_checkpoints"
    group = Group.MEMORY
    label = "Ask the agent to save facts and rules as its context fills"
    skill_of = "memory"
    when = "a context mark holds your writes until you record a fact, a rule or nothing"

    title = "Save to memory as context fills"

    aliases = ("context",)


    abstract = """
        Each time the agent's context reaches a mark, it decides whether to save a fact or a rule
        before it changes files. Once a week it rereads every rule and fact.
    """

    help = """
        When a context mark holds your writes, decide before any other write: file what a later session would get wrong without
        as journal fact create "<claim>" --set keywords="<word>,<word>", a ruling that binds every environment as
        journal rule create "<ruling>" --set keywords="<word>,<word>", or run journal nothing "<why>" when there is nothing
        to keep. Any of the three releases the hold. The marks are the percentages in the feature's trigger.

        Once a week run journal rule reread when you are told it is owed: it prints every standing rule and fact in full and
        marks the reading done.
    """

    trigger = Trigger(at=(50, 70, 90, 95), unit=PERCENT)

    behaviours = [
        Behaviour(
            name="rereading",
            title="Reread every rule and fact once a week",
            prefix="checks",
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
