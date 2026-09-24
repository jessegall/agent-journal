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
             "clicking, not reading: you say in a few words what you think they want to build, they click the reading that "
             "fits or type their own, and after two such rounds you draft. Every turn is one question or one short line, "
             "never a paragraph. Every answer to a request goes to the board, never to the chat: a question with "
             "options while you work out the feature, and the one-line reply on the card at the end. You talk only about the feature and its tickets, never about rows, chips, numbers, commands "
             "or the journal. Use judgment at every step: the board's name, its brief and the cards already on it carry "
             "meaning, and each step is done the way that fits this request rather than to the letter.",
    "starts_on": "message.requested",
    "started_by": USER,
    "steps": [
        ("Understand the request", "Goal: find out which feature they want to build, as concisely and accurately as you can. "
                                   "This turn never drafts. Read the context before you write anything: the board's name and "
                                   "brief (journal board show <board n>) and the cards already on it (journal ticket board "
                                   "<board n>). They usually say what the feature is about: on a board called Shared Journal, "
                                   "\"I want to share\" means a shareable journal. Then ask one question that names the "
                                   "feature you think they mean, with three readings of it as options: journal board ask "
                                   "<board n> \"You want to build <the feature>?\" --abstract \"<one plain line on why you "
                                   "think so>\" --set options='[{\"title\": \"<reading>\", \"text\": \"<what that "
                                   "means>\"}, ...]'. Each option title is a few words; its text is one short line saying what "
                                   "that reading would give them. The abstract never names the board or its cards; it says "
                                   "the reasoning in plain words, like \"Sharing here most likely means the journal itself\". "
                                   "Never offer filler such as Yes / Yes, but / No, and never ask an open question with no "
                                   "options when you can guess. When their words cannot be read, say so in the question: "
                                   "\"I couldn't read that. Do you mean <your guess>?\", still with three readings. The "
                                   "question is your whole turn: do not reply to their message as well. Their input stays "
                                   "open, so they may type instead of clicking; treat typed words as their answer. When it "
                                   "is answered: journal sequence next <this sequence> --about <ref>."),
        ("Narrow it down", "Goal: turn the reading they chose into something concrete enough to draft. Always take this "
                           "second round, even when the first answer felt clear; never draft after one answer. Ask one "
                           "question about the part of the feature that most decides the tickets, with three options: "
                           "journal board ask <board n> \"<the question>\" --abstract \"<why this decides it>\" --set "
                           "options='[{\"title\": \"<direction>\", \"text\": \"For example, <a short description of "
                           "the feature this would give>\"}, ...]'. From this round on, every option carries an example in "
                           "its text: a short, muted line under the title that describes the feature they would get, such as "
                           "\"For example, one server everyone connects to, changes show at once\"; several options may "
                           "each describe a different feature. Their input stays open here too. When it is answered and you "
                           "know enough to write the tickets, go on to Draft the tickets; when you still cannot tell, go on "
                           "to Offer choices. Either way: journal sequence next <this sequence> --about <ref>."),
        ("Offer choices", "Only when the two rounds left it unclear. Skip this step when it is clear: journal sequence next "
                          "<this sequence> --about <ref>. Otherwise ask once more with three or four concise choices, each "
                          "a meaning they might have with an example in its text, and Start over as the last: journal board "
                          "ask <board n> \"Which one?\" --abstract \"<what is still open>\" --set options='[{\"title\": "
                          "\"<meaning>\", \"text\": \"For example, <the feature>\"}, ..., {\"title\": \"Start "
                          "over\"}]' --set final=true. final=true closes their input, so they can only click. Draft from "
                          "their pick; Start over clears the panel, so give the run up with journal sequence abandon <this "
                          "sequence> --about <ref> --why \"start over\"."),
        ("Draft the tickets", "First say how many tickets you will write, an educated guess on the low side: journal board "
                              "expect <board n> <count>. The panel shows that many placeholders; more fade in if you write "
                              "more, and none is ever taken away. Then draft each ticket on the same board: journal ticket "
                              "create \"<the work>\" --abstract \"<one line>\" --brief \"<the fuller story>\" --set "
                              "board=<n> --set draft=true. The title is a few words naming the work. The abstract is one "
                              "line of at most 140 characters, shown whole on the card. The brief is the card's back, under "
                              "More info: what it does, why it matters, what it touches and what done looks like, in a few "
                              "short paragraphs. Name what waits on what with journal ticket depend <n> <other>, and the "
                              "role that should take it with --set owner=<domain>/<role> when the project has one. When "
                              "every ticket is drafted: journal sequence next <this sequence> --about <ref>."),
        ("Say one line", "Reply to their message in one short line of at most 200 characters about the tickets, like "
                         "\"Five tickets drafted, in order. Pick the ones to keep.\" No paragraphs, no lists, and no mention "
                         "of rows, chips, numbers, commands or the journal. The user then picks the ones to keep. Finish "
                         "with journal sequence next <this sequence> --about <ref>."),
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
