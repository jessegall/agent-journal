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
    "brief": "A request typed into a board's New work panel becomes draft tickets for one feature. The panel is a place of "
             "clicking, not reading: you ask which feature they mean, they click one of your readings or type their own, "
             "and after two such rounds you draft, or, if it is still unclear, you offer one last round of choices without "
             "the input. Every turn is one question on the board or one short line, never a paragraph and never in the chat. "
             "You talk only about the feature and its tickets, never about rows, chips, ticket numbers, commands or the "
             "journal. A typed answer counts as that round: if it names a feature none of your options did, it replaces the "
             "request, so ask Understand the request again about it; if it is a question, answer it in one line in your next "
             "question's abstract; if it cannot be read, ask again with \"I couldn't read that. Which of these?\", and that "
             "counts as the round. An answer of Start over, at any step, means they closed the panel or began again: give the "
             "run up with journal sequence abandon <this sequence> --about <ref> --why \"start over\" and write nothing "
             "more to the board. Use judgment at every step: the board's name, its brief and the cards already on it carry "
             "meaning, and each step is done the way that fits this request rather than to the letter.",
    "starts_on": "message.requested",
    "started_by": USER,
    "steps": [
        ("Understand the request", "Goal: find out which feature they want to build. This turn never drafts. Read the "
                                   "context before you write anything: the board's name and brief (journal board show <board "
                                   "n>) and the cards already on it (journal ticket board <board n>). They usually say what "
                                   "the feature is about: on a board called Shared Journal, \"I want to share\" is about a "
                                   "shareable journal. Offer the three features their words most likely mean on this board, "
                                   "most likely first, each clearly different from the others, with a short line under each "
                                   "saying what it would give them: journal board ask <board n> \"Which <kind of feature> do "
                                   "you mean?\" --abstract \"<one plain line on why you read it so>\" --set "
                                   "options='[{\"title\": \"<feature>\", \"text\": \"<what it gives them>\"}, ...]'. "
                                   "When their words already name one feature, the first option is their request as written "
                                   "and the other two are its nearest larger and smaller versions. When their words cannot "
                                   "be read, the question is \"I couldn't read that. Which of these?\". The abstract never "
                                   "names the board or its cards. Never offer filler such as Yes / No, and never an open "
                                   "question without options when you can guess. The question is your whole turn: do not "
                                   "reply to their message. When it is answered: journal sequence next <this sequence> "
                                   "--about <ref>."),
        ("Narrow it down", "Goal: shape the feature they picked until you can write its tickets. Always take this round, "
                           "even when the first answer felt clear. Ask one question about the part of the feature that most "
                           "decides the tickets, in terms of what they would see or do, never how it is built, with three "
                           "options that each carry an example: journal board ask <board n> \"<the question>\" --abstract "
                           "\"<their pick, settled, in a few words, like A shared journal, then.>\" --set "
                           "options='[{\"title\": \"<direction>\", \"text\": \"For example, <what they would get>\"}, "
                           "...]'. The question is your whole turn. When it is answered: journal sequence next <this "
                           "sequence> --about <ref>."),
        ("Offer choices", "Decide whether a third round is needed. When their two answers make the feature clear, skip it: "
                          "journal sequence next <this sequence> --about <ref>. Otherwise ask once more with three or four "
                          "finished versions of the feature built from their two answers, each with what it gives them as "
                          "the example: journal board ask <board n> \"Which one?\" --abstract \"<what is still open>\" "
                          "--set options='[{\"title\": \"<version>\", \"text\": \"For example, <what it gives>\"}, "
                          "..., {\"title\": \"Start over\"}]' --set final=true. final=true closes their input, so they "
                          "can only click. Draft from their pick: journal sequence next <this sequence> --about <ref>."),
        ("Draft the tickets", "First, once and before your first ticket, say how many you will write, an educated guess on "
                              "the low side: journal board expect <board n> <count>. The panel shows that many placeholders, "
                              "and more appear if you write more; never call it again with a smaller number. Then draft each "
                              "ticket on the same board: journal ticket create \"<the work>\" --abstract \"<one line>\" "
                              "--brief \"<the card's back>\" --set board=<n> --set draft=true. The title is a few words "
                              "naming the work. The abstract is one line of at most 140 characters, shown whole on the card. "
                              "The brief is the card's back, under More info, in four short parts: What: <what it does>. "
                              "Why: <why it matters>. Touches: <what it changes>. Done when: <what done looks like>. When a "
                              "ticket needs another first: journal ticket depend <the ticket that waits> <the ticket it "
                              "needs first>. Name the role that should take it with --set owner=<domain>/<role> when the "
                              "project has one. Do not reply to their message until every ticket is drafted: your one-line "
                              "reply is what tells the panel drafting is done. When every ticket is drafted: journal "
                              "sequence next <this sequence> --about <ref>."),
        ("Say one line", "Reply to their message in one short line of at most 200 characters about the tickets, like "
                         "\"Five tickets drafted. Pick the ones to keep.\" No paragraphs, no lists, and no ticket numbers "
                         "such as #12, rows, chips, commands or the journal. The reply tells the panel you are done, and the "
                         "user picks the ones to keep. Finish with journal sequence next <this sequence> --about <ref>."),
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
