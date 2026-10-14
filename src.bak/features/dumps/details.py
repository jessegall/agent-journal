from declaring.details import FeatureDetails, Line
from declaring.groups import Group


class DumpsDetails(FeatureDetails):
    explains = 'The agent sorts files you send together by subject and files them in a collection. You can rename or remove what it made.'
    name = "dumps"
    group = Group.RECORDS
    label = "Sort dumped files into a collection"
    when = "the user drops items into a dump, or a dump is being worked"

    title = "Dumps"


    abstract = "Drop many files at once. The agent sorts them by subject and files them into a collection."

    help = """
        A dump holds pasted text and dropped files; each is an item. Sort the pile by subject:
        one document per subject, named for what it is about, never after the file it came in.
        Record journal dump note <n> <item> "<what it is>", then journal dump filed <n> <item>
        "<what it did>" --refs "<ref, ref>" --added "<ref>" for what you wrote unasked, listed in refs too, or journal dump
        failed <n> <item> "<why>". What you file is in the journal at once, in the dump's
        collection. journal dump name <n> "<name>" names that collection for what the items are
        about, and journal dump log <n> "<status>" tells the user what you are doing;
        journal dump ask <n> "<question>" asks the user in the dump window, and they answer there.
        What the user writes in the dump reaches you as a message about it: answer there with
        journal dump say <n> "<text>" (at most 600 characters), never in the chat; the chat
        shows a small mark that you answered in the dump.
        One dump is worked at a time; the next waits until it closes. journal dump items <n> lists where every item stands, and the dump
        closes by itself once every item is filed or failed.
    """

    lines = [
        Line(
            name="arrived",
            title="dump {{n}} has {{count}} to file - journal dump items {{n}}",
            brief="""
                load journal-dumps if it is not loaded, then follow the Filing a dump sequence step by step. Tell the user
                what you do with journal dump log; ask only in the dump window, never in the chat.
            """,
        ),
        Line(
            name="carry on",
            title="dump {{n}} still has {{count}} to file - carry on filing it",
            brief="""
                finish it without waiting for the user: journal dump items {{n}} shows what is left. Ask only what you
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
            title="dump {{n}} is filed ({{outcome}}) - sum it up for the user",
            brief="""
                sum up what you filed and where in two or three lines, with any next step worth taking as a button on the
                dump: journal dump offer {{n}} '[{"ask": "Want me to plan the mobile layout?", "label": "Plan it"}]' --summary
                "<what you filed and where>", or '[]' for none. Start nothing yourself.
            """,
        ),
        Line(
            name="chose",
            title="the user chose {{label}} for dump {{n}}",
            brief="carry that step out, and log it on the dump.",
        ),
        Line(
            name="decide",
            title="the user left dump {{n}} to you - finish it",
            brief="""
                take the next step you think best and file anything still open yourself, logging each
                step on the dump. Nothing waits for the user.
            """,
        ),
    ]
