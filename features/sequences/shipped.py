from features.sequences.controller import Sequences
from resources.base import SYSTEM

FILING_A_DUMP = {
    "title": "Filing a dump",
    "brief": "What the agent does with everything a user drops in a dump, from reading it to offering what comes next.",
    "starts_on": "dump.created",
    "steps": [
        ("Read everything", "journal dump items <n> lists what was dropped; read every item in full. When the pasted text holds "
                            "several things, such as a summary, a transcript and a link, split it with journal dump split <n> "
                            "\"Summary, Transcript, Link\". Name its collection for what the items are about with journal dump name "
                            "<n> \"<name>\"."),
        ("File every item", "Decide what each item becomes and file it: a transcript or meeting notes become a doc with a summary at "
                            "the top, the decisions and the open points; an image is tagged and filed with the doc it belongs to; a "
                            "document becomes a doc or is attached to the doc it extends; a stated goal becomes a plan. Log each "
                            "step with journal dump log <n> \"<short title>\" --detail \"<what and why>\", with --making \"<type>, "
                            "<title>\" before a row exists and --on <type:n> once it does. Record journal dump note, then journal "
                            "dump filed or journal dump failed. Ask only what you cannot tell, with journal dump ask <n> "
                            "\"<question>\" --guesses \"<one>|<two>\"."),
        ("Offer what comes next", "Once every item is filed the dump closes. Offer two to four next steps with journal dump offer <n> "
                                  "'[{\"label\": \"...\"}]'; the user also has You decide. Nothing it made is in the journal until "
                                  "the user picks one."),
    ],
}
SHIPPED = (FILING_A_DUMP,)


def ship(record) -> list[str]:
    sequences = Sequences(record, actor=SYSTEM)
    known = {row["title"] for row in sequences.summaries()}
    made = []
    for shipped in SHIPPED:
        if shipped["title"] in known:
            continue
        row = sequences.create(shipped["title"], brief=shipped["brief"], starts_on=shipped["starts_on"], system=True)
        for title, body in shipped["steps"]:
            sequences.section(row.n, title, body)
        made.append(shipped["title"])
    return made
