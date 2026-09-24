from features.sequences.controller import Sequences
from resources.base import SECTION, SYSTEM

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
BUILDING_A_PLAN = {
    "title": "Building a plan",
    "brief": "How a plan is built with the user, in order, from its goal to the moment it is ready for them to approve.",
    "starts_on": "plan.created",
    "steps": [
        ("Name the goal", "Settle with the user what is true when the plan is done, and set it as the plan's goal."),
        ("Add the phases", "Add every phase in order with journal plan phase <n> \"<title>\" --when \"<complete when>\", and "
                           "--checkpoint where the user should look before it goes on."),
        ("File the rows", "journal plan stage <n> todos, then file the to-dos and put each under its phase with journal plan "
                          "todos <n> <phase> <rows>."),
        ("Hand it over", "When every phase has rows, journal plan ready <n>. Only the user approves it; you start it when "
                         "they have."),
    ],
}
WORKING_A_BOARD_CARD = {
    "title": "Working a card from the board",
    "brief": "A card on a Kanban board is worked by clicking, not reading: the agent asks one short question with options to "
             "pick, drafts the tickets, and says one line. It talks only about the tickets, never about rows, chips, commands "
             "or the journal.",
    "starts_on": "ticket.created",
    "steps": [
        ("Read the card", "journal ticket show <n>: its board, stage and brief. If you drafted this card yourself, give the run "
                          "up with journal sequence abandon <this sequence> --about <ref> --why \"my own draft\"."),
        ("Ask one short question", "When the tickets turn on something only the user knows, ask it on the board in a few words, "
                                   "like \"Which login first?\", with two to four options of a few words each: journal board "
                                   "ask <board n> \"<question>\" --set options='[...]'. One question at a time, no paragraphs; "
                                   "the board shows it and the user clicks. Wait for the answer only where the tickets depend "
                                   "on it."),
        ("Draft the tickets", "Draft each ticket on the same board: journal ticket create \"<the work>\" --brief \"<what is "
                              "wanted>\" --set board=<n> --set draft=true. A title is a few words and a brief two or three "
                              "plain sentences. Name what waits on what with journal ticket depend, and the role that should "
                              "take it with --set owner=<domain>/<role> when the project has one."),
        ("Say one line", "Reply on the card in one short line about the tickets, like \"Three tickets drafted, pick the ones to "
                         "keep.\" No paragraphs, no lists, and no mention of rows, chips, numbers, commands or the journal. The "
                         "user picks, clicks or says what to change; take their answer back to Ask one short question."),
    ],
}
SHIPPED = (FILING_A_DUMP, BUILDING_A_PLAN, WORKING_A_BOARD_CARD)


def ship(record) -> list[str]:
    sequences = Sequences(record, actor=SYSTEM)
    standing = {row["title"]: row["n"] for row in sequences.summaries() if not row["deleted"]}
    return [shipped["title"] for shipped in SHIPPED if in_step(sequences, shipped, standing.get(shipped["title"]))]


def in_step(sequences: Sequences, shipped: dict, n: int | None) -> bool:
    steps = [{SECTION.title: title, SECTION.body: body} for title, body in shipped["steps"]]
    row = sequences.load(n) if n else sequences.create(shipped["title"], starts_on=shipped["starts_on"], system=True)
    if n and (not row.system or (row.brief, row.starts_on, row.sections) == (shipped["brief"], shipped["starts_on"], steps)):
        return False
    row.brief, row.starts_on, row.sections = shipped["brief"], shipped["starts_on"], steps
    sequences.save(row, "updated")
    return True
