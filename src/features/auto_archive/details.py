from features.trigger import MINUTES, Trigger
from features.base import FeatureDetails
from features.groups import Group


class AutoArchiveDetails(FeatureDetails):
    name = "auto_archive"
    group = Group.ARCHIVE
    label = "Archive closed items"
    has_skill = False

    title = "Auto-archive"

    aliases = ("retention",)

    abstract = """
        Reports age out and finished to-dos are archived after their keep days, and machine rows past the count their type
        keeps are removed, once an hour
    """

    help = "Closed items are compressed after 3 days but can still be read and searched. Reports and to-dos leave the main list after their keep days. The journal keeps only its newest routine notices and browser answers."

    trigger = Trigger(every=60, unit=MINUTES)
