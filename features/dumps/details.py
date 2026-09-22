from features.base import FeatureDetails


class DumpsDetails(FeatureDetails):
    name = "dumps"

    title = "Dumps"

    abstract = "Drop anything in one place and the agent reads every item and files it into the record"

    help = """
        A dump holds pasted text and dropped files; each is an item. The agent decides what
        every item becomes and files it, recording journal dump note <n> <item> "<what it is>",
        then journal dump filed <n> <item> "<what it did>" "<ref, ref>" or journal dump failed
        <n> <item> "<why>". journal dump items <n> lists where every item stands, and the dump
        closes by itself once every item is filed or failed.
    """
