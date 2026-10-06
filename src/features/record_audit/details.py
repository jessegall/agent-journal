from features.base import FeatureDetails, Line
from features.trigger import MINUTES, Trigger
from features.groups import Group


class RecordAuditDetails(FeatureDetails):
    explains = 'The journal checks for items that point to missing files or commands. The agent sees the findings and can close outdated items.'
    name = "record_audit"
    group = Group.RECORDS
    label = "Find items that point at missing files or commands"
    has_skill = False

    title = "Find outdated items"

    aliases = ("cleanup",)

    abstract = """
        Once a day the agent is told which items point at a file that is gone or a command that does
        not exist, and which have waited on you too long.
    """

    help = "Each finding names the item, what is wrong with it, and the command that closes it."

    trigger = Trigger(every=1440, unit=MINUTES)

    lines = [
        Line(
            name="evidence",
            title="{{count}} in the record have evidence against them",
            brief="{{found}}",
        ),
    ]
