from features.base import FeatureDetails, Line


class DumpsDetails(FeatureDetails):
    name = "dumps"
    when = "the user drops items into a dump, or a dump is being worked"

    title = "Dumps"


    abstract = "Drop anything in one place and the agent reads every item and files it into the record"

    help = """
        A dump holds pasted text and dropped files; each is an item. You decide what
        every item becomes and file it, recording journal dump note <n> <item> "<what it is>",
        then journal dump filed <n> <item> "<what it did>" "<ref, ref>" or journal dump failed
        <n> <item> "<why>". journal dump name <n> "<name>" names its collection for what the
        items are about, and journal dump log <n> "<status>" tells the user what you are doing;
        journal dump ask <n> "<question>" asks the user in the dump window, and they answer there.
        One dump is worked at a time; the next waits until it closes. journal dump items <n> lists where every item stands, and the dump
        closes by itself once every item is filed or failed.
    """

    lines = [
        Line(
            name="arrived",
            title="dump {{n}}, {{title}}, has {{count}} to file - journal dump items {{n}}",
            brief="""
                Load the journal-dumps skill first if it is not loaded. The Filing a dump sequence
                hands you its steps one at a time: follow each one and mark it done with journal
                sequence next, and it hands you the next. Tell the user what you do with journal
                dump log, and ask only in the dump window, never in the chat: the user is looking
                at the dump.
            """,
        ),
        Line(
            name="carry on",
            title="dump {{n}} still has {{count}} to file - carry on filing it",
            brief="""
                Filing a dump is yours to finish without waiting for the user, whether or not auto
                mode is on: journal dump items {{n}} shows what is left. Ask only what you truly
                cannot tell, with journal dump ask.
            """,
        ),
        Line(
            name="answered",
            title="the user answered your question on dump {{n}} - {{answer}}",
            brief="carry on filing with that answer. The question was: {{question}}",
        ),
        Line(
            name="filed",
            title="dump {{n}} is filed ({{outcome}}) - offer the user what to do next",
            brief="""
                Offer two to four next steps as buttons on the dump itself, never as a suggestion
                elsewhere: journal dump offer {{n}} '[{"label": "Approve the design plan", "type":
                "plan", "n": 3, "action": "approve"}, {"label": "Leave it for now"}]'. A step that is
                a journal action carries its type, n and action and runs as the user when pressed.
                The user also has You decide, which hands the rest to you.
            """,
        ),
        Line(
            name="chose",
            title="the user chose {{label}} for dump {{n}}",
            brief="what the dump made is now in the journal. Carry that step out, and log it on the dump.",
        ),
        Line(
            name="decide",
            title="the user left dump {{n}} to you - finish it",
            brief="""
                what the dump made is now in the journal. Take the next step you think best and file
                anything still open yourself, logging each step on the dump. Nothing waits for the user.
            """,
        ),
    ]
