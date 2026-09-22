from features.base import FeatureDetails, Line


class DumpsDetails(FeatureDetails):
    name = "dumps"

    title = "Dumps"

    abstract = "Drop anything in one place and the agent reads every item and files it into the record"

    help = """
        A dump holds pasted text and dropped files; each is an item. The agent decides what
        every item becomes and files it, recording journal dump note <n> <item> "<what it is>",
        then journal dump filed <n> <item> "<what it did>" "<ref, ref>" or journal dump failed
        <n> <item> "<why>". journal dump name <n> "<name>" names its collection for what the
        items are about, and journal dump log <n> "<status>" tells the user what the agent is doing.
        One dump is worked at a time; the next waits until it closes. journal dump items <n> lists where every item stands, and the dump
        closes by itself once every item is filed or failed.
    """

    lines = [
        Line(
            name="arrived",
            title="dump {{n}}, {{title}}, has {{count}} to file - journal dump items {{n}}",
            brief="""
                Read every item, then name its collection for what the items are about, in a few
                words a person would search for: journal dump name {{n}} "<name>". Decide what each
                item becomes and file it: a transcript or meeting
                notes become a doc with a summary at the top, the decisions and the open points; an
                image is tagged with a few words and filed with the doc it belongs to; a document
                becomes a doc or is attached to the doc it extends; where the material states a goal
                or asks for a plan, start a plan with that goal. Record each item as you go with
                journal dump note, then journal dump filed or journal dump failed, and tell the user
                what you are doing at each step with journal dump log {{n}} "<status>": the dump
                window shows it live. Ask only when you
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
