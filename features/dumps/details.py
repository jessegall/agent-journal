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
        items are about, and journal dump log <n> "<status>" tells the user what the agent is doing;
        journal dump ask <n> "<question>" asks the user in the dump window, and they answer there.
        One dump is worked at a time; the next waits until it closes. journal dump items <n> lists where every item stands, and the dump
        closes by itself once every item is filed or failed.
    """

    lines = [
        Line(
            name="arrived",
            title="dump {{n}}, {{title}}, has {{count}} to file - journal dump items {{n}}",
            brief="""
                Load the journal-dumps skill first if it is not loaded. Read every item, then name its collection for what the items are about, in a few
                words a person would search for: journal dump name {{n}} "<name>". Decide what each
                item becomes and file it: a transcript or meeting
                notes become a doc with a summary at the top, the decisions and the open points; an
                image is tagged with a few words and filed with the doc it belongs to; a document
                becomes a doc or is attached to the doc it extends; where the material states a goal
                or asks for a plan, start a plan with that goal. Record each item as you go with
                journal dump note, then journal dump filed or journal dump failed, and tell the user
                what you are doing at each step with journal dump log {{n}} "<status>": the dump
                window shows it live. Create a row as soon as you start on it and log with
                --on <type:n>, so its card appears while you write it. Ask only when you
                truly cannot tell what an item is for, and ask in the dump window with journal
                dump ask {{n}} "<question>", never in the chat: the user is looking at the dump.
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
