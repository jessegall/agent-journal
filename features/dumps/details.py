from features.base import FeatureDetails, Line


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

    lines = [
        Line(
            name="arrived",
            title="dump {{n}}, {{title}}, has {{count}} to file - journal dump items {{n}}",
            brief="""
                Read every item and decide what it becomes, then file it: a transcript or meeting
                notes become a doc with a summary at the top, the decisions and the open points; an
                image is tagged with a few words and filed with the doc it belongs to; a document
                becomes a doc or is attached to the doc it extends; where the material states a goal
                or asks for a plan, start a plan with that goal. Record each item as you go with
                journal dump note, then journal dump filed or journal dump failed. Ask only when you
                truly cannot tell what an item is for.
            """,
        ),
        Line(
            name="filed",
            title="dump {{n}} is filed ({{outcome}}) - suggest the next step",
            brief="""
                File a suggestion for what you would do next with what was filed, and why, and link
                it to dump:{{n}} and collection:{{collection}}. A plan to write, a decision to make or
                a follow-up to send: the user accepts, adjusts or declines it.
            """,
        ),
    ]
