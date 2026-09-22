from features.trigger import MINUTES, Trigger
from features.base import FeatureDetails


class RetentionDetails(FeatureDetails):
    name = "auto_archive"

    title = "Auto-archive"

    aliases = ("retention",)

    abstract = """
        Reports age out, finished to-dos are archived and notifications the user has seen and nudges the agent was given are
        removed, after their keep days, once an hour
    """

    help = "keep.report and keep.todo are days per environment; 0 keeps everything listed. A type that declares how many rows it keeps (nudges 100, seen notifications 100, closed notices 100, answered browser asks 50) is pruned to that count, oldest first."

    trigger = Trigger(every=60, unit=MINUTES)
