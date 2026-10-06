import re

from features import discover
from features.base import REGISTRY
from features.sequences.controller import Sequences
from features.sequences.shipping import ShippedSequence
from features.triggers.controller import Triggers
from resources.base import AGENT, SECTION, SYSTEM

TITLED = re.compile(r"^sequence:\{(.+)\}$")


def included(shipped: ShippedSequence) -> tuple[str, str]:
    return shipped.title, f"sequence:{{{shipped.title}}}"


FILING_A_DUMP = ShippedSequence(
    title="Sort dumped files",
    brief="When the user writes in the dump, answer there with journal dump say <dump n> \"<text>\", never in the chat. "
             "What the agent does with a pile a user drops in a dump: sort it by subject, file each subject straight into the "
             "dump's collection, then sum up and suggest.",
    starts_on="dump.created",
    talks_in="the dump window",
    steps=[
        ("Read each file", "journal dump items <dump n> lists what was dropped. Go through the items one at a time: read an item in "
                            "full and at once record what it is with journal dump note <dump n> <item> \"<what it is>\", so the pile "
                            "shows it as read, before you open the next. When the pasted text holds "
                            "several things, such as a summary, a transcript and a link, split it with journal dump split <dump n> "
                            "\"Summary, Transcript, Link\". Name its collection for what the pile is about with journal dump name "
                            "<dump n> \"<name>\"."),
        ("File each subject", "Sort the pile by concern: one document per subject, never one big document, even when a single "
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
        ("Summarise and suggest next steps", "Once every item is filed the dump closes. Sum up what you filed and where with journal dump "
                               "offer <dump n> '[...]' --summary \"<two or three plain lines>\". Suggest up to four next steps only "
                               "where one is worth taking, each a question with a button: {\"ask\": \"<question>\", \"label\": "
                               "\"<button>\"}; use '[]' when there is nothing to suggest. The user takes or leaves each one."),
    ],
)
BUILDING_A_PLAN = ShippedSequence(
    title="Building a plan",
    brief="How a plan is built with the user, in order, from its goal to the moment it is ready for them to approve.",
    starts_on="plan.created",
    steps=[
        ("Agree on the plan’s goal", "Settle with the user what is true when the plan is done, and set it as the plan's goal."),
        ("Add the plan’s phases", "Add every phase in order with journal plan phase <plan n> \"<title>\" --when \"<complete when>\", and "
                           "--checkpoint where the user should look before it goes on."),
        ("Add to-dos to each phase", "journal plan stage <plan n> todos, then file the to-dos and put each under its phase with journal plan "
                          "todos <plan n> <phase> <rows>."),
        ("Ask the user to approve the plan", "When every phase has rows, journal plan ready <plan n>. Only the user approves it; you start it when "
                         "they have."),
    ],
)
WRITING_AN_UPDATE = ShippedSequence(
    title="Writing an update",
    brief="The user asked for an update or a TLDR. Write an update report on what happened since they last opened "
             "one, and answer with it. You talk about the work, never about rows, commands or the journal.",
    words=("give me an update", "an update please", "any updates", "status update", "tldr", "tl;dr", "catch me up",
              "what happened since", "geef me een update", "update graag", "nog updates", "statusupdate", "stand van zaken",
              "praat me bij", "bijpraten", "wat is er gebeurd"),
    steps=[
        ("Find what changed since the last update", "journal report changes lists what happened since the user last opened an update, under need, "
                             "done, doing, plans, commits and also. Read any row you do not remember before you sum it "
                             "up. Then journal sequence next <this sequence> --about <ref>."),
        ("Write the update report", "journal report recap \"<one or two plain sentences: what got done, what is under way, what "
                             "waits on the user>\" writes the report with those rows in that order. Give every row under "
                             "need and doing a short note of what it waits on or what is being done now: journal report "
                             "note <report n> <row> \"<line>\". Add a row the list missed with journal report item <report "
                             "n> <section> <row> \"<title>\", and take out one that is only noise with journal report drop "
                             "<report n> <row>. Then journal sequence next <this sequence> --about <ref>."),
        ("Tell the user in the chat", "Reply in one short line that says the update is pinned at the bottom of the chat, like \"Here's "
                           "the update; I pinned it at the bottom of the chat.\" Leave the report's reference out: the pinned "
                           "card is how the user opens it. Finish with journal sequence next <this sequence> --about <ref>."),
    ],
)
FINISHING_WHAT_YOU_WROTE = ShippedSequence(
    title="Filing and sharing a document or report",
    brief="The closing steps of a document or report: file it where it belongs, link what it relates to, offer the user a "
             "next step where one fits, then answer with it.",
    steps=[
        ("Add the document or report to a collection", "If a collection the user keeps fits what you wrote, add it: journal collection add "
                                   "<collection n> <ref>. Look with journal collection all first. When none fits but other documents or reports "
                                   "on the same subject sit in no collection, make one named for the subject with journal collection create "
                                   "\"<subject>\", add this and them, and say so in one line. A row with nothing related gets no collection of "
                                   "its own. Then journal sequence next <this sequence> --about <ref>."),
        ("Link the items behind the document or report", "Link the rows it answers or was built on, such as the to-dos, plans, documents, reports or "
                                    "messages it is about, with journal <type> link <ref n> \"<row>\" for each. Leave out rows "
                                    "it only mentions in passing. Then journal sequence next <this sequence> --about <ref>."),
        ("Offer the user a next step", "If it asks the user to decide or approve something, give it buttons: journal <type> update "
                                "<ref n> --set buttons='[{\"label\": \"Accept this proposal\", \"say\": \"I accept this "
                                "proposal\", \"choice\": \"answer\"}, {\"label\": \"Change it first\", \"say\": \"I want "
                                "changes first\", \"choice\": \"answer\"}]'. A button with say sends those words to you as the "
                                "user's message; one naming a type, n and action runs that command. Buttons of one decision share "
                                "a choice, so the others go once one is pressed. Skip this when nothing waits on the user. Then "
                                "journal sequence next "
                                "<this sequence> --about <ref>."),
        ("Tell the user in the chat", "Say in one or two plain lines what it concludes, then its reference on a line of its own, like "
                           "doc 41 or report 98, never in backticks. Finish with journal sequence next <this sequence> --about <ref>."),
    ],
)
WRITING_A_DOCUMENT = ShippedSequence(
    title="Writing a document",
    brief="You started a document. Lay out its chapters first, write them one at a time so the user can follow along in "
             "its inspector, then file it, link it and answer with it.",
    starts_on="doc.created",
    started_by=AGENT,
    only_when_idle=True,
    unless={"written": True},
    steps=[
        ("Add the document’s chapter headings", "If the text is already written, in a file or the conversation, do not copy it in chapter by "
                                 "chapter: journal sequence abandon <this sequence> --about <ref> --why \"already written\" "
                                 "--sure, journal doc delete <doc n> \"filed whole instead\", and file it whole with journal "
                                 "doc file \"<title>\" <file>. Otherwise put every chapter you plan on the document before writing any of them: journal doc section "
                                 "<doc n> \"<chapter>\" \"Being written.\" for each, in order. Put the document's reference "
                                 "on a line of its own in the chat, like doc 41, so the user can open it and watch. Then "
                                 "journal sequence next <this sequence> --about <ref>."),
        ("Write the document’s chapters", "Write the chapters one at a time and in order with journal doc section <doc n> \"<chapter>\" "
                               "\"<body>\"; the user sees each one appear where you are. Cut a chapter that turned out "
                               "empty with journal doc cut <doc n> \"<chapter>\". Then journal sequence next <this sequence> "
                               "--about <ref>."),
        included(FINISHING_WHAT_YOU_WROTE),
    ],
)
FILING_A_WRITTEN_DOCUMENT = ShippedSequence(
    title="Filing a document that is already written",
    brief="You filed a document whose text was already written. Its chapters are in; file it, link it and answer with it.",
    starts_on="doc.created",
    started_by=AGENT,
    only_when_idle=True,
    unless={"written": False},
    steps=[included(FINISHING_WHAT_YOU_WROTE)],
)
WRITING_A_REPORT = ShippedSequence(
    title="Writing a report",
    brief="You started a report. Lay out its parts first, write them one at a time so the user can follow along, then "
             "file it, link it and answer with it.",
    starts_on="report.created",
    started_by=AGENT,
    only_when_idle=True,
    unless={"kind": "update"},
    steps=[
        ("Add the report’s section headings", "Lead with the answer in the report's brief, then put every part you plan on the report "
                              "before writing any of them: journal report section <report n> \"<part>\" \"Being written.\" "
                              "for each, in order: the evidence, what was already sound, what remains uncertain. Then journal "
                              "sequence next <this sequence> --about <ref>."),
        ("Write the report’s sections", "Write the parts one at a time and in order with journal report section <report n> \"<part>\" "
                            "\"<body>\"; the user sees each one appear where you are. Then journal sequence next <this sequence> "
                            "--about <ref>."),
        included(FINISHING_WHAT_YOU_WROTE),
    ],
)
CHECKING_THE_INSTRUCTION_FILES = ShippedSequence(
    title="Checking the instruction files",
    brief="AGENTS.md and CLAUDE.md changed, or the user asked for a check. Find where they and the journal's block at "
             "their head tell an agent opposite things, report it, and propose each fix as a suggestion. Never edit the files.",
    words=("check the instruction files", "check agents.md", "check claude.md", "contradictions in the instructions",
              "controleer de instructiebestanden", "controleer agents.md", "tegenstrijdigheden in de instructies"),
    steps=[
        ("Read the instruction files", "Read AGENTS.md and CLAUDE.md at the project root and the journal's block at the head of each, "
                           "narrowly: grep for the headings, then sed the sections you need. Note every place where two of "
                           "them tell an agent opposite things, with the file and line on both sides. Then journal sequence "
                           "next <this sequence> --about <ref>."),
        ("Report any conflicting instructions", "With nothing found, say so in one plain line and move on. Otherwise journal report create "
                                  "\"Contradictions in the instruction files\" --brief \"<each one: both sides with file and "
                                  "line, which should win and why>\". Then journal sequence next <this sequence> --about <ref>."),
        ("Suggest a fix for each conflict", "File each fix as a suggestion whose brief holds the exact change, as a diff: journal suggestion "
                             "suggest \"<the change>\" --brief \"<why, and the diff>\". Never edit the files yourself; the "
                             "user accepts a suggestion first, and the journal's block is only ever written by the journal. When an "
                             "accepted fix comes back as a to-do, apply it only where the lines still read as the diff shows; if they "
                             "changed since, read the files again and propose the fix anew. "
                             "Finish with journal sequence next <this sequence> --about <ref>."),
    ],
)
SEQUENCES = (FILING_A_DUMP, BUILDING_A_PLAN, WRITING_AN_UPDATE, CHECKING_THE_INSTRUCTION_FILES, FINISHING_WHAT_YOU_WROTE, WRITING_A_DOCUMENT,
             FILING_A_WRITTEN_DOCUMENT, WRITING_A_REPORT)

SHIPPED_FIELDS = ("brief", "starts_on", "started_by", "only_when_idle", "talks_in", "lasting", "unless", "dispatch")


def shipped_sequences() -> list[ShippedSequence]:
    discover()
    return [sequence for feature in REGISTRY.values() for sequence in feature.sequences]


def ship(record) -> list[str]:
    sequences = Sequences(record, actor=SYSTEM)
    shipping = shipped_sequences()
    numbers = {row["title"]: row["n"] for row in sequences.rows.summaries() if not row["deleted"]}
    retire(sequences, {shipped.title for shipped in shipping})
    for shipped in shipping:
        if shipped.title not in numbers:
            numbers[shipped.title] = sequences.create(shipped.title, starts_on=shipped.starts_on, system=True).n
    return [shipped.title for shipped in shipping if in_step(sequences, shipped, numbers)]


def retire(sequences: Sequences, titles: set[str]) -> None:
    for row in sequences.rows.every():
        if row.system and not row.deleted and row.title not in titles:
            sequences.delete(row.n, why="the journal no longer ships it")


def watched(record, shipped: ShippedSequence) -> str:
    return Triggers(record, actor=SYSTEM).watch_for(shipped.title, shipped.words).ref


def unwatched(record, shipped: ShippedSequence) -> None:
    Triggers(record, actor=SYSTEM).unwatch(shipped.title, f"{shipped.title} now starts on {shipped.starts_on}")


def in_step(sequences: Sequences, shipped: ShippedSequence, numbers: dict[str, int]) -> bool:
    if shipped.words:
        shipped = shipped.started_on(watched(sequences.record, shipped))
    else:
        unwatched(sequences.record, shipped)
    steps = [{SECTION.title: title, SECTION.body: TITLED.sub(lambda named: f"sequence:{numbers[named[1]]}", body)} for title, body in shipped.steps]
    row = sequences.load(numbers[shipped.title])
    shape = {**{name: getattr(shipped, name) for name in SHIPPED_FIELDS}, "sections": steps}
    if not row.system or {name: getattr(row, name) for name in shape} == shape:
        return False
    for name, value in shape.items():
        setattr(row, name, value)
    sequences.save(row, "updated")
    return True
