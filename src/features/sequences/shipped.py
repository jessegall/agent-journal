import re

from features.sequences.controller import Sequences
from features.sequences.drafting import DRAFTING
from features.sequences.exploration import EXPLORATION, PANEL
from features.sequences.orchestration import ORCHESTRATING_MOMENTS, ORCHESTRATION
from features.triggers.controller import Triggers
from features.triggers.resource import FROM_USER, START
from resources.base import AGENT, SECTION, SYSTEM, USER

TITLED = re.compile(r"^sequence:\{(.+)\}$")


def included(shipped: dict) -> tuple[str, str]:
    return shipped["title"], f"sequence:{{{shipped['title']}}}"


FILING_A_DUMP = {
    "title": "Filing a dump",
    "brief": "When the user writes in the dump, answer there with journal dump say <dump n> \"<text>\", never in the chat. "
             "What the agent does with a pile a user drops in a dump: sort it by subject, file each subject straight into the "
             "dump's collection, then sum up and suggest.",
    "starts_on": "dump.created",
    "talks_in": "the dump window",
    "started_by": "",
    "steps": [
        ("Read everything", "journal dump items <dump n> lists what was dropped. Go through the items one at a time: read an item in "
                            "full and at once record what it is with journal dump note <dump n> <item> \"<what it is>\", so the pile "
                            "shows it as read, before you open the next. When the pasted text holds "
                            "several things, such as a summary, a transcript and a link, split it with journal dump split <dump n> "
                            "\"Summary, Transcript, Link\". Name its collection for what the pile is about with journal dump name "
                            "<dump n> \"<name>\"."),
        ("File by subject", "Sort the pile by concern: one document per subject, never one big document, even when a single "
                            "transcript or note covers several. Name each for what it is about, never after the file it came "
                            "in. Decide the shape yourself: where a summary, meeting notes, the decisions or the action items "
                            "would help, write them without being asked and list them with --added; action items become to-dos. "
                            "An image goes with the document it belongs to. Never make a plan or start work: that is a "
                            "suggestion for the end. Everything you file is in the journal at once, in the dump's collection. "
                            "Log each step with journal dump log <dump n> \"<short title>\" --detail \"<what and why>\", with "
                            "--making \"<type>, <title>\" before a row exists and --on <type:n> once it does. File each item as soon as you "
                            "have what it needs, one at a time: journal dump filed <dump n> <item> \"<what you did>\" --refs \"<ref, ref>\" --added \"<ref>\" (every added row also in refs) or "
                            "journal dump failed. Ask only what you cannot tell, with journal dump ask <dump n> \"<question>\" "
                            "--guesses \"<one>|<two>\"."),
        ("Sum up and suggest", "Once every item is filed the dump closes. Sum up what you filed and where with journal dump "
                               "offer <dump n> '[...]' --summary \"<two or three plain lines>\". Suggest up to four next steps only "
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
        ("Add the phases", "Add every phase in order with journal plan phase <plan n> \"<title>\" --when \"<complete when>\", and "
                           "--checkpoint where the user should look before it goes on."),
        ("File the rows", "journal plan stage <plan n> todos, then file the to-dos and put each under its phase with journal plan "
                          "todos <plan n> <phase> <rows>."),
        ("Hand it over", "When every phase has rows, journal plan ready <plan n>. Only the user approves it; you start it when "
                         "they have."),
    ],
}
REVISING_THE_DRAFTS = {
    "title": "Revising the board's drafts",
    "brief": "The user typed a change in a board's New work panel while its drafts show. Change only what they asked for, "
             "keep every other draft as it is, and say one line. Never start over and never ask round one again.",
    "starts_on": "message.revised",
    "started_by": USER,
    "talks_in": PANEL,
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
        ("Say one line", "Say it in the panel in one short line with journal board say <board n> \"<line>\", of at most 200 characters about what changed, like \"Made the "
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
             "it describes, each saying where in the document it came from, for the user to pick. Only tickets on this "
             "board: never a plan, a doc or a to-do made from it. There are no rounds of "
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
                              "when, Risk>\" --set about=<ref> --set board=<board n> --set draft=true --set source=\"<document>\" "
                              "--set source_id=\"<section and page, like §4 · p.4>\". Before each section, journal board progress "
                              "<board n> \"<section>\" now; after it, journal board progress <board n> \"<section>\" read "
                              "--drafts <how many it gave>, or out when it holds no work. Leave out background and context, and "
                              "follow the user's note. When the document leaves a choice open that changes a ticket, ask "
                              "it on the board with journal board ask <board n> \"<question>\" --set options='[...]' and "
                              "change the draft when it is answered. Then offer two to four groups they can pick at once, such as what the first release needs or one subject: journal board group <board n> \"<name>\" \"<ticket>, <ticket>\". When every ticket is drafted: journal sequence next "
                              "<this sequence> --about <ref>."),
        ("Say one line", "Say it in the panel in one short line with journal board say <board n> \"<line>\", of at most 200 characters, like \"7 drafts from 6 "
                         "sections; I left out the background.\" No lists and no ticket numbers. Finish with journal "
                         "sequence next <this sequence> --about <ref>."),
    ],
}
WRITING_AN_UPDATE = {
    "title": "Writing an update",
    "brief": "The user asked for an update or a TLDR. Write an update report on what happened since they last opened "
             "one, and answer with it. You talk about the work, never about rows, commands or the journal.",
    "starts_on": "",
    "started_by": "",
    "words": ("give me an update", "an update please", "any updates", "status update", "tldr", "tl;dr", "catch me up",
              "what happened since"),
    "steps": [
        ("See what changed", "journal report changes lists what happened since the user last opened an update, under need, "
                             "done, doing, plans, commits and also. Read any row you do not remember before you sum it "
                             "up. Then journal sequence next <this sequence> --about <ref>."),
        ("Write the update", "journal report recap \"<one or two plain sentences: what got done, what is under way, what "
                             "waits on the user>\" writes the report with those rows in that order. Give every row under "
                             "need and doing a short note of what it waits on or what is being done now: journal report "
                             "note <report n> <row> \"<line>\". Add a row the list missed with journal report item <report "
                             "n> <section> <row> \"<title>\", and take out one that is only noise with journal report drop "
                             "<report n> <row>. Then journal sequence next <this sequence> --about <ref>."),
        ("Answer with it", "Reply in one short line that says the update is pinned at the bottom of the chat, like \"Here's "
                           "the update; I pinned it at the bottom of the chat.\", then the report's reference on a line of "
                           "its own, like `report 98`, so the chat shows it as a card the user opens. Finish with journal "
                           "sequence next <this sequence> --about <ref>."),
    ],
}
FINISHING_WHAT_YOU_WROTE = {
    "title": "Finishing what you wrote",
    "brief": "The closing steps of a document or report: file it where it belongs, link what it relates to, offer the user a "
             "next step where one fits, then answer with it.",
    "starts_on": "",
    "started_by": "",
    "steps": [
        ("Put it in a collection", "If a collection the user keeps fits what you wrote, add it: journal collection add "
                                   "<collection n> <ref>. Look with journal collection all first; skip this when none fits, and "
                                   "never make a collection just for it. Then journal sequence next <this sequence> --about <ref>."),
        ("Link what it relates to", "Link the rows it answers or was built on, such as the to-dos, plans, documents, reports or "
                                    "messages it is about, with journal <type> link <ref n> \"<row>\" for each. Leave out rows "
                                    "it only mentions in passing. Then journal sequence next <this sequence> --about <ref>."),
        ("Offer the next step", "If it asks the user to decide or approve something, give it buttons: journal <type> update "
                                "<ref n> --set buttons='[{\"label\": \"Accept this proposal\", \"say\": \"I accept this "
                                "proposal\", \"choice\": \"answer\"}, {\"label\": \"Change it first\", \"say\": \"I want "
                                "changes first\", \"choice\": \"answer\"}]'. A button with say sends those words to you as the "
                                "user's message; one naming a type, n and action runs that command. Buttons of one decision share "
                                "a choice, so the others go once one is pressed. Skip this when nothing waits on the user. Then "
                                "journal sequence next "
                                "<this sequence> --about <ref>."),
        ("Answer with it", "Say in one or two plain lines what it concludes, then its reference on a line of its own, like "
                           "`doc 41` or `report 98`. Finish with journal sequence next <this sequence> --about <ref>."),
    ],
}
WRITING_A_DOCUMENT = {
    "title": "Writing a document",
    "brief": "You started a document. Lay out its chapters first, write them one at a time so the user can follow along in "
             "its inspector, then file it, link it and answer with it.",
    "starts_on": "doc.created",
    "started_by": AGENT,
    "only_when_idle": True,
    "steps": [
        ("Lay out the chapters", "Put every chapter you plan on the document before writing any of them: journal doc section "
                                 "<doc n> \"<chapter>\" \"Being written.\" for each, in order. Put the document's reference "
                                 "on a line of its own in the chat, like `doc 41`, so the user can open it and watch. Then "
                                 "journal sequence next <this sequence> --about <ref>."),
        ("Write each chapter", "Write the chapters one at a time and in order with journal doc section <doc n> \"<chapter>\" "
                               "\"<body>\"; the user sees each one appear where you are. Cut a chapter that turned out "
                               "empty with journal doc cut <doc n> \"<chapter>\". Then journal sequence next <this sequence> "
                               "--about <ref>."),
        included(FINISHING_WHAT_YOU_WROTE),
    ],
}
WRITING_A_REPORT = {
    "title": "Writing a report",
    "brief": "You started a report. Write its findings part by part, then file it, link it and answer with it.",
    "starts_on": "report.created",
    "started_by": AGENT,
    "only_when_idle": True,
    "unless": {"kind": "update"},
    "steps": [
        ("Write the findings", "Lead with the answer in the report's brief, then write each part with journal report section "
                               "<report n> \"<part>\" \"<body>\": the evidence, what was already sound, what remains "
                               "uncertain. Then journal sequence next <this sequence> --about <ref>."),
        included(FINISHING_WHAT_YOU_WROTE),
    ],
}
SHIPPED = (FILING_A_DUMP, BUILDING_A_PLAN, EXPLORATION, DRAFTING, REVISING_THE_DRAFTS, BUILDING_A_BOARD, DRAFTING_FROM_A_DOCUMENT,
           WRITING_AN_UPDATE, FINISHING_WHAT_YOU_WROTE, WRITING_A_DOCUMENT, WRITING_A_REPORT, ORCHESTRATION, *ORCHESTRATING_MOMENTS)


def ship(record) -> list[str]:
    sequences = Sequences(record, actor=SYSTEM)
    standing = {row["title"]: row["n"] for row in sequences.summaries() if not row["deleted"]}
    retire(sequences, {shipped["title"] for shipped in SHIPPED})
    return [shipped["title"] for shipped in SHIPPED if in_step(sequences, shipped, standing.get(shipped["title"]))]


def retire(sequences: Sequences, titles: set[str]) -> None:
    for row in sequences._every():
        if row.system and not row.deleted and row.title not in titles:
            sequences.delete(row.n, why="the journal no longer ships it")


def watched(record, shipped: dict) -> str:
    triggers = Triggers(record, actor=SYSTEM)
    row = next((t for t in triggers._every() if t.title == shipped["title"] and not t.deleted), None) or triggers.create(
        shipped["title"], brief=f"Starts the sequence {shipped['title']}", words=list(shipped["words"]), words_in=FROM_USER, does=START,
        system=True)
    if not row.system:
        triggers.update(row.n, system=True)
    return f"trigger:{row.n}"


def unwatched(record, shipped: dict) -> None:
    triggers = Triggers(record, actor=SYSTEM)
    for row in triggers._every():
        if row.title == shipped["title"] and row.system and not row.deleted:
            triggers.delete(row.n, why=f"{shipped['title']} now starts on {shipped['starts_on']}")


def in_step(sequences: Sequences, shipped: dict, n: int | None) -> bool:
    if not shipped.get("words"):
        unwatched(sequences.record, shipped)
    shipped = {**shipped, "starts_on": watched(sequences.record, shipped)} if shipped.get("words") else shipped
    numbers = {row["title"]: row["n"] for row in sequences.summaries() if not row["deleted"]}
    steps = [{SECTION.title: title, SECTION.body: TITLED.sub(lambda named: f"sequence:{numbers[named[1]]}", body)} for title, body in shipped["steps"]]
    idle = shipped.get("only_when_idle", False)
    row = sequences.load(n) if n else sequences.create(shipped["title"], starts_on=shipped["starts_on"], system=True)
    shape = (shipped["brief"], shipped["starts_on"], shipped["started_by"], idle, shipped.get("talks_in", ""), shipped.get("lasting", False),
             shipped.get("unless", {}), steps)
    if n and (not row.system or (row.brief, row.starts_on, row.started_by, row.only_when_idle, row.talks_in, row.lasting, row.unless,
                                 row.sections) == shape):
        return False
    row.brief, row.starts_on, row.started_by, row.only_when_idle, row.talks_in, row.lasting, row.unless, row.sections = shape
    sequences.save(row, "updated")
    return True
