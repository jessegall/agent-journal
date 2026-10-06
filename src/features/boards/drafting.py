from features.sequences.shipping import ShippedSequence
from features.boards.exploration import FILLER, LOG, PANEL
from resources.base import USER

DRAFTING = ShippedSequence(
    title="Drafting the board's cards",
    brief="You know the goal and what done means (journal board show <board n>). Draft the cards that reach it, one by one, "
             "so each appears on the board while you write, then say one short line. Together the cards must meet every clause of "
             "the goal, including the work the user did not think of. Talk only about the feature and its tickets, never about rows, chips, ticket numbers, "
             "commands or the journal. " + LOG,
    talks_in=PANEL,
    dispatch=FILLER,
    steps=[
        ("Guess the count", "Before your first card, guess how many you will write, at least 6 and preferably 8: journal board "
                            "expect <board n> <count>. The panel shows that many placeholders. You may not finish with fewer cards "
                            "than you guessed. Then journal sequence next <this sequence> --about <ref>."),
        ("Map the work", "Before any card, list what reaching the goal takes: the core pieces, setup and configuration, data "
                         "and migrations, tests, documentation, and the edge and failure cases. Tell the panel in a few words "
                         "with journal board log <board n> \"<short status>\". Then journal sequence next <this sequence> --about <ref>."),
        ("Draft the cards", "Draft at least 6 cards, preferably 8, as many as the request logically holds: one card per piece of "
                            "work that can be built, reviewed and merged on its own branch; the steps inside it go in its brief. Draft them in the order they "
                            "should run: journal ticket create \"<the work>\" --abstract \"<one line>\" --brief \"<the card's "
                            "back>\" --set about=<ref> --set board=<n> --set draft=true --set source=user --set covers=<clause "
                            "numbers with a comma, like 1,3 or 2,> --set after=<cards it waits on, like 48,49>. The title names the work "
                            "in a few words; the abstract is one line of at most 140 characters; the brief has five short "
                            "parts: What, Why, Touches, Done when, Risk. Link each card to any doc or plan you read for it, "
                            "and name the cards it needs first in the same create with --set after, never a separate depend. When the project "
                            "has an organization, name the domain that answers for it with --set owner=<domain>. To write "
                            "more cards than you guessed, raise the guess first with journal board expect and say so in the "
                            "panel with journal board say <board n> \"I think I'll need more cards than I said.\". Then "
                            "journal sequence next <this sequence> --about <ref>."),
        ("Check against the goal", "Read the board's clauses and your cards together (journal board show <board n>, journal "
                                   "ticket board <board n>). Every clause needs a card whose done-when meets it: draft what is "
                                   "missing (raise the count first with journal board expect). A card that cannot be built, "
                                   "reviewed and merged on its own is merged into the card it needs. Then journal sequence next "
                                   "<this sequence> --about <ref>."),
        ("Offer groups", "Offer two to four groups of the drafted cards the user can pick at once; the panel shows them "
                         "beside All. Name each for what picking it means, such as Quick fixes first, one group per area "
                         "of the work, or the smallest set that is useful on its own: journal board group <board n> "
                         "\"<name>\" \"<ticket>, <ticket>\". Then journal sequence next <this sequence> --about <ref>."),
        ("Say one line", "Say it in the panel with journal board say <board n> \"<line>\", at most 200 characters about the "
                         "cards, like \"Five tickets drafted. Pick the ones to keep.\" No numbers such as #12, rows, chips, "
                         "commands or the journal. Then say you wait for the user's picks with journal board wait <board n>, "
                         "and finish with journal sequence next <this sequence> --about <ref>."),
    ],
)


REVISING_THE_DRAFTS = ShippedSequence(
    title="Revising the board's drafts",
    brief="The user typed a change in a board's New work panel while its drafts show. Change only what they asked for, "
             "keep every other draft as it is, and say one line. Never start over and never ask round one again.",
    starts_on="message.revised",
    started_by=USER,
    talks_in=PANEL,
    dispatch=FILLER,
    steps=[
        ("Read the change", "Read their words and the drafts made for this request on the board. Work out which cards the "
                            "change is about. When it is unclear, ask one short question on the board with the cards it might "
                            "mean as options: journal board ask <board n> \"<question>\" --set options='[...]' --set pick=<n>. When it is "
                            "answered, or clear from the start: journal sequence next <this sequence> --about <ref>."),
        ("Change the drafts", "Change only the cards they named: journal ticket update <n> with a new title, --abstract or "
                              "--brief, or delete a card they dropped (journal ticket delete <n> --why \"<their words>\"). "
                              "Anything new they ask for becomes cards of its own, one per part, never a to-do. "
                              "For a card they asked to add, first raise the count to the total the panel should show: journal "
                              "board expect <board n> <count>, then journal ticket create as in drafting. When they ask you to choose cards for them, check the ones you would keep: journal board pick <board n> \"<ticket>, <ticket>\". When every change is "
                              "made: journal sequence next <this sequence> --about <ref>."),
        ("Recheck the drafts", "Check the drafts still meet every clause of the goal (journal board show <board n>), that at "
                               "least 6 remain unless they asked for fewer, and that the order between cards still holds (journal "
                               "ticket depend). Draft what a removal left uncovered. Then journal sequence next <this sequence> --about <ref>."),
        ("Say one line", "Say it in the panel in one short line with journal board say <board n> \"<line>\", of at most 200 characters about what changed, like \"Made the "
                         "sign-in card smaller and added one for invites.\" No paragraphs and no ticket numbers. Then say you wait "
                         "for the user with journal board wait <board n>, and finish with journal sequence next <this sequence> --about <ref>."),
    ],
)
BUILDING_A_BOARD = ShippedSequence(
    title="Building a board from a document",
    brief="The user handed a document to a new board, and you set the board up from it: its stages, its name when they left "
             "it to you, and a ticket for every piece of work in the stage the document puts it in. The board fills while "
             "they watch, so log each move in plain words. They may write to you meanwhile: answer, and when they ask you to "
             "stop, finish at once with journal board built. When they remove the board the run is given up for you; write "
             "nothing more to it.",
    starts_on="board.commissioned",
    started_by=USER,
    steps=[
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
)
DRAFTING_FROM_A_DOCUMENT = ShippedSequence(
    title="Drafting tickets from a document",
    brief="The user handed a document to a board's New work panel. Read it whole and draft one ticket per piece of work "
             "it describes, each saying where in the document it came from, for the user to pick. Only tickets on this "
             "board: never a plan, a doc or a to-do made from it. There are no rounds of "
             "questions first: the document is the answer to them. Ask only what the document leaves open, on the board. "
             "You talk only about the work and its tickets, never about rows, commands or the journal. An answer of Start "
             "over means they closed the panel: the run is given up for you, so write nothing more to the board.",
    starts_on="message.commissioned",
    started_by=USER,
    dispatch=FILLER,
    steps=[
        ("Read the document", "journal message show <ref> names the file under document and gives the user's note as its "
                              "text; journal board paths <board n> gives the file's path. Read all of it, and the board's "
                              "cards (journal ticket board <board n>), before you write anything. Then show its sections "
                              "in order, which the panel lists while you work: journal board outline <board n> "
                              "\"<section>|<section>|...\". Then state the goal and what done means as the document gives "
                              "them: journal board score <board n> 5 --goal \"<goal>\" --done \"<clause>|<clause>\". Then journal "
                              "sequence next <this sequence> --about <ref>."),
        ("Draft the tickets", "Say how many you will draft, at least 6 unless the document holds less work (then give the "
                              "reason with --fewer \"<why>\"): journal board expect <board n> <count>. Map the work the document "
                              "leaves out as well, such as tests, migrations and documentation, and mark those cards --set "
                              "source_id=\"added: not in the document\". Give every card the clauses it serves with --set covers=<n,n>. Then, "
                              "section by section, one ticket per piece that can be built, reviewed and merged on its own: "
                              "journal ticket create \"<the work>\" --abstract \"<one line>\" --brief \"<What, Why, Touches, Done "
                              "when, Risk>\" --set about=<ref> --set board=<board n> --set draft=true --set source=\"<document>\" "
                              "--set source_id=\"<section and page, like §4 · p.4>\". Before each section, journal board progress "
                              "<board n> \"<section>\" now; after it, journal board progress <board n> \"<section>\" read "
                              "--drafts <how many it gave>, or out when it holds no work. Leave out background and context, and "
                              "follow the user's note. When the document leaves a choice open that changes a ticket, ask "
                              "it on the board with journal board ask <board n> \"<question>\" --set options='[...]' --set pick=<n> and "
                              "change the draft when it is answered. Then offer two to four groups they can pick at once, such as what the first release needs or one subject: journal board group <board n> \"<name>\" \"<ticket>, <ticket>\". When every ticket is drafted: journal sequence next "
                              "<this sequence> --about <ref>."),
        ("Say one line", "Say it in the panel in one short line with journal board say <board n> \"<line>\", of at most 200 characters, like \"7 drafts from 6 "
                         "sections; I left out the background.\" No lists and no ticket numbers. Finish with journal "
                         "sequence next <this sequence> --about <ref>."),
    ],
)
