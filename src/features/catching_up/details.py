from features.base import FeatureDetails, Line
from features.groups import Group
from features.settings import Setting


class CatchingUpDetails(FeatureDetails):
    explains = 'After a compaction the agent reads the latest messages before it changes anything. You choose how many.'
    name = "catching_up"
    group = Group.AGENT
    label = "Make the agent read the latest messages after a compaction"
    has_skill = False

    title = "Catch up after a compaction"

    abstract = """
        A compaction keeps a summary of the conversation and drops the chat around it. Until the agent has read
        the latest messages again, its writes wait.
    """

    help = """
        When the agent's context is compacted, its writes wait until it runs journal message recent, which prints
        the latest messages in full, yours and its own, oldest first. Reading is never held.
    """

    settings = [
        Setting(
            name="count",
            default=50,
            title="How many of the latest messages it reads",
            unit="messages",
        ),
    ]

    lines = [
        Line(
            name="read held",
            title="the conversation was compacted — read the latest {{count}} messages before any other write — journal message recent",
        ),
    ]
