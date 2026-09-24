from features.sequences.controller import Sequences
from resources.base import SECTION, SYSTEM, USER

FILING_A_DUMP = {
    "title": "Filing a dump",
    "brief": "What the agent does with a pile a user drops in a dump: sort it by subject, file each subject straight into the "
             "dump's collection, then sum up and suggest.",
    "starts_on": "dump.created",
    "started_by": "",
    "steps": [
        ("Read everything", "journal dump items <n> lists what was dropped; read every item in full. When the pasted text holds "
                            "several things, such as a summary, a transcript and a link, split it with journal dump split <n> "
                            "\"Summary, Transcript, Link\". Name its collection for what the pile is about with journal dump name "
                            "<n> \"<name>\"."),
        ("File by subject", "Sort the pile by concern: one document per subject, never one big document, even when a single "
                            "transcript or note covers several. Name each for what it is about, never after the file it came "
                            "in. Decide the shape yourself: where a summary, meeting notes, the decisions or the action items "
                            "would help, write them without being asked and list them with --added; action items become to-dos. "
                            "An image goes with the document it belongs to. Never make a plan or start work: that is a "
                            "suggestion for the end. Everything you file is in the journal at once, in the dump's collection. "
                            "Log each step with journal dump log <n> \"<short title>\" --detail \"<what and why>\", with "
                            "--making \"<type>, <title>\" before a row exists and --on <type:n> once it does. Record journal "
                            "dump note, then journal dump filed <n> <item> \"<what you did>\" \"<ref, ref>\" --added \"<ref>\" or "
                            "journal dump failed. Ask only what you cannot tell, with journal dump ask <n> \"<question>\" "
                            "--guesses \"<one>|<two>\"."),
        ("Sum up and suggest", "Once every item is filed the dump closes. Sum up what you filed and where with journal dump "
                               "offer <n> '[...]' --summary \"<two or three plain lines>\". Suggest up to four next steps only "
                               "where one is worth taking, each a question with a button: {\"ask\": \"<question>\", \"label\": "
                               "\"<button>\"}; use '[]' when there is nothing to suggest. The user takes or leaves each one."),
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
        ("Draft the tickets", "Most requests are one ticket. Draft one ticket per piece of work that can be built, reviewed "
                              "and merged on its own branch without the others; the steps inside a ticket go in its brief, for "
                              "the plan its own agent drafts when it starts, never as tickets of their own. First, once and "
                              "before your first ticket, say how many you will write, an educated guess on the low side: "
                              "journal board expect <board n> <count>. The panel shows that many placeholders, and more appear "
                              "if you write more; never call it again with a smaller number. Then draft each ticket in the "
                              "order they should run: journal ticket create \"<the work>\" --abstract \"<one line>\" --brief "
                              "\"<the card's back>\" --about <ref> --set board=<n> --set draft=true --set source=user. The "
                              "title is a few words naming the work. The abstract is one line of at most 140 characters, shown "
                              "whole on the card. The brief is the card's back, under More info, in five short parts: What: "
                              "<what it does>. Why: <why it matters>. Touches: <what it changes>. Done when: <what done looks "
                              "like>. Risk: <none, or what reaches outside the project or into production, which makes its "
                              "plan wait for the user's approval>. Link each draft to any doc or plan you read for it: journal "
                              "ticket link <n> doc:<m>. When a ticket needs another first, one of your drafts or a card "
                              "already on any board: journal ticket depend <the ticket that waits> <the ticket it needs first>. "
                              "When the project has an organization (journal ticket organization), name the domain that "
                              "answers for it with --set owner=<domain>; its lead picks the roles. Do not reply to their "
                              "message until every ticket is drafted: your one-line reply is what tells the panel drafting is "
                              "done. Then offer two to four groups they can pick at once, such as what the first release needs or one subject: journal board group <board n> \"<name>\" \"<ticket>, <ticket>\". When every ticket is drafted: journal sequence next <this sequence> --about <ref>."),
        ("Say one line", "Reply to their message in one short line of at most 200 characters about the tickets, like "
                         "\"Five tickets drafted. Pick the ones to keep.\" No paragraphs, no lists, and no ticket numbers "
                         "such as #12, rows, chips, commands or the journal. The reply tells the panel you are done, and the "
                         "user picks the ones to keep. Finish with journal sequence next <this sequence> --about <ref>."),
    ],
}
REVISING_THE_DRAFTS = {
    "title": "Revising the board's drafts",
    "brief": "The user typed a change in a board's New work panel while its drafts show. Change only what they asked for, "
             "keep every other draft as it is, and say one line. Never start over and never ask round one again.",
    "starts_on": "message.revised",
    "started_by": USER,
    "steps": [
        ("Read the change", "Read their words and the drafts made for this request on the board. Work out which cards the "
                            "change is about. When it is unclear, ask one short question on the board with the cards it might "
                            "mean as options: journal board ask <board n> \"<question>\" --set options='[...]'. When it is "
                            "answered, or clear from the start: journal sequence next <this sequence> --about <ref>."),
        ("Change the drafts", "Change only the cards they named: journal ticket update <n> with a new title, --abstract or "
                              "--brief, or delete a card they dropped (journal ticket delete <n> --why \"<their words>\"). "
                              "For a card they asked to add, first raise the count to the total the panel should show: journal "
                              "board expect <board n> <count>, then journal ticket create as in drafting. When they ask you to choose cards for them, check the ones you would keep: journal board pick <board n> \"<ticket>, <ticket>\". When every change is "
                              "made: journal sequence next <this sequence> --about <ref>."),
        ("Say one line", "Reply to their message in one short line of at most 200 characters about what changed, like \"Made the "
                         "sign-in card smaller and added one for invites.\" No paragraphs and no ticket numbers. Finish with "
                         "journal sequence next <this sequence> --about <ref>."),
    ],
}
BUILDING_A_BOARD = {
    "title": "Building a board from a document",
    "brief": "The user handed a document to a new board, and you set the board up from it: its stages, its name when they left "
             "it to you, and a ticket for every piece of work in the stage the document puts it in. The board fills while "
             "they watch, so log each move in plain words. They may write to you meanwhile: answer, and when they ask you to "
             "stop, finish at once with journal board built. When they remove the board the run is given up for you; write "
             "nothing more to it.",
    "starts_on": "board.commissioned",
    "started_by": USER,
    "steps": [
        ("Read the document", "journal board show <board n> names the document under building, with the user's note under "
                              "steer; journal board paths <board n> gives its path. Read all of it before you write anything. "
                              "Then journal sequence next <this sequence> --about <ref>."),
        ("Set the stages", "Choose three to six stages from how the document describes progress, such as shipped, in testing, "
                           "next and later, and add each in order with journal board stage <board n> \"<stage>\" [start|review|"
                           "done]. When building says name_it, name the board for what the document is about with journal "
                           "board update <board n> --title \"<name>\". Log each with journal board log <board n> \"<what you "
                           "did and why>\". Then journal sequence next <this sequence> --about <ref>."),
        ("File the tickets", "For every piece of work: journal ticket create \"<title>\" --brief \"<what the document says "
                             "about it>\" --set board=<board n> --set stage=\"<stage>\" --set source=\"<document>\" --set "
                             "source_id=\"<section and page>\". Go section by section and log each one with journal board log, "
                             "saying where you put things and why when it is not obvious. Then journal sequence next <this "
                             "sequence> --about <ref>."),
        ("Finish", "journal board built <board n> \"<one line: how many stages and tickets, and what you left out and why>\". "
                   "The user keeps the board or removes it. Finish with journal sequence next <this sequence> --about <ref>."),
    ],
}
DRAFTING_FROM_A_DOCUMENT = {
    "title": "Drafting tickets from a document",
    "brief": "The user handed a document to a board's New work panel. Read it whole and draft one ticket per piece of work "
             "it describes, each saying where in the document it came from, for the user to pick. There are no rounds of "
             "questions first: the document is the answer to them. Ask only what the document leaves open, on the board. "
             "You talk only about the work and its tickets, never about rows, commands or the journal. An answer of Start "
             "over means they closed the panel: the run is given up for you, so write nothing more to the board.",
    "starts_on": "message.commissioned",
    "started_by": USER,
    "steps": [
        ("Read the document", "journal message show <ref> names the file under document and gives the user's note as its "
                              "text; journal board paths <board n> gives the file's path. Read all of it, and the board's "
                              "cards (journal ticket board <board n>), before you write anything. Then show its sections "
                              "in order, which the panel lists while you work: journal board outline <board n> "
                              "\"<section>|<section>|...\". Then journal sequence next <this sequence> --about <ref>."),
        ("Draft the tickets", "Say how many you will draft, on the low side: journal board expect <board n> <count>. Then, "
                              "section by section, one ticket per piece that can be built, reviewed and merged on its own: "
                              "journal ticket create \"<the work>\" --abstract \"<one line>\" --brief \"<What, Why, Touches, Done "
                              "when, Risk>\" --about <ref> --set board=<board n> --set draft=true --set source=\"<document>\" "
                              "--set source_id=\"<section and page, like §4 · p.4>\". Before each section, journal board progress "
                              "<board n> \"<section>\" now; after it, journal board progress <board n> \"<section>\" read "
                              "--drafts <how many it gave>, or out when it holds no work. Leave out background and context, and "
                              "follow the user's note. When the document leaves a choice open that changes a ticket, ask "
                              "it on the board with journal board ask <board n> \"<question>\" --set options='[...]' and "
                              "change the draft when it is answered. Then offer two to four groups they can pick at once, such as what the first release needs or one subject: journal board group <board n> \"<name>\" \"<ticket>, <ticket>\". When every ticket is drafted: journal sequence next "
                              "<this sequence> --about <ref>."),
        ("Say one line", "Reply to their message in one short line of at most 200 characters, like \"7 drafts from 6 "
                         "sections; I left out the background.\" No lists and no ticket numbers. Finish with journal "
                         "sequence next <this sequence> --about <ref>."),
    ],
}
SHIPPED = (FILING_A_DUMP, BUILDING_A_PLAN, WORKING_A_BOARD_CARD, REVISING_THE_DRAFTS, BUILDING_A_BOARD, DRAFTING_FROM_A_DOCUMENT)


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
