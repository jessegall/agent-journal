from features.trigger import MINUTES, Trigger
from features.base import FeatureDetails


class AutoArchiveDetails(FeatureDetails):
    name = "auto_archive"
    has_skill = False

    title = "Auto-archive"

    aliases = ("retention",)

    abstract = """
        Reports age out and finished to-dos are archived after their keep days, and machine rows past the count their type
        keeps are removed, once an hour
    """

    help = "keep.report and keep.todo are days per environment; 0 keeps everything listed. Closed rows are zipped after keep.pack days (3), one zip per day of their last change, and are still read, listed and searched from it; 0 never zips. A type that declares how many rows it keeps (nudges 100, seen notifications 100, closed notices 100, answered browser asks 50) is pruned to that count, oldest first."

    trigger = Trigger(every=60, unit=MINUTES)
