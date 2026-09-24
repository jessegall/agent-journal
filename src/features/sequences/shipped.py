from features.sequences.controller import Sequences
from resources.base import SECTION, SYSTEM, USER

FILING_A_DUMP = {
    "title": "Filing a dump",
    "brief": "What the agent does with everything a user drops in a dump, from reading it to offering what comes next.",
    "starts_on": "dump.created",
    "started_by": "",
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
    "started_by": "",
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
    "brief": "A request from a board's New work panel becomes tickets by clicking, not reading: the agent first makes sure what "
             "the user means, then drafts, and says one line each turn. It talks only about the work, never about rows, chips, "
             "commands or the journal. Use judgment at every step: the board's name and the cards already on it carry "
             "meaning, and each step is done the way that fits this request, not to the letter.",
    "starts_on": "message.requested",
    "started_by": USER,
    "steps": [
        ("Say what they mean", "Your first turn never drafts. Make a real guess from their words, the board's name and the "
                               "tickets already on it (journal ticket board <board n>); never ask what the board already says. "
                               "When their words make no sense, say so in the question, like \"I couldn't read that. Do you "
                               "mean <your guess>?\" Put one short line of why you think so in --abstract, and ask on the "
                               "board whether that is it: journal board ask <board n> \"Do you mean <the work>?\" --abstract "
                               "\"<why you think so>\" --set "
                               "options='[{\"title\": \"Yes\"}, {\"title\": \"No\"}]'. The question is your whole turn: do not "
                               "reply to their message as well. Draft only once you are sure what they want in enough detail to "
                               "write the tickets: a yes to a broad guess, like sharing the journal, is not enough, so your "
                               "second turn asks one short follow-up about what they want from it, the same way. After their "
                               "second answer, go on to Draft the tickets when it is clear; when it is not, go on to Offer "
                               "choices."),
        ("Offer choices", "Only when two guesses did not land: ask once with three or four concise options, each a meaning "
                          "they might have, in a few words, and Start over as the last: journal board ask <board n> \"Which "
                          "one?\" --set options='[...]'. The input closes while the options show, so they pick one; draft "
                          "from their pick; the question is your whole turn, with no reply beside it. Start over clears the panel: give the run up with journal sequence abandon."),
        ("Draft the tickets", "First say how many tickets you will write, an educated guess on the low side: journal board "
                              "expect <board n> <count>. The panel shows that many placeholders; more fade in if you write "
                              "more, and none is ever taken away. Then draft each ticket on the same board: journal ticket create \"<the work>\" --abstract \"<one "
                              "line>\" --brief \"<the deeper explanation>\" --set board=<n> --set draft=true. A title is a few "
                              "words, the abstract one line of at most 140 characters shown on the card, and the brief the "
                              "fuller story on the card's back, under More info: what it does, why it matters, what it "
                              "touches and what done looks like, in a few short paragraphs. Name what waits on what with journal ticket depend, and "
                              "the role that should take it with --set owner=<domain>/<role> when the project has one."),
        ("Say one line", "Reply to their message in one short line of at most 200 characters about the tickets, like \"Three "
                         "tickets drafted, pick the ones to keep.\" No paragraphs, no lists, and no mention of rows, chips, "
                         "numbers, commands or the journal. The user picks the ones to keep."),
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
    shape = (shipped["brief"], shipped["starts_on"], shipped["started_by"], steps)
    if n and (not row.system or (row.brief, row.starts_on, row.started_by, row.sections) == shape):
        return False
    row.brief, row.starts_on, row.started_by, row.sections = shape
    sequences.save(row, "updated")
    return True
