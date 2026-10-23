from journal.models.sequence import Sequence

PLAIN_WRITING = "Write what this asks for in the user's own language in plain words, plain English or plain Dutch as the user speaks, never in the voice you speak in. "

PLAN_BUILDING = Sequence(
    title="Building a plan",
    trigger_event="plan.created",
    end_condition=("ready", "approved", "started", "done"),
    steps=(
        PLAIN_WRITING + "Agree on the plan's goal: settle with the user what is true when the plan is done, and put it in the plan's brief with `journal plan brief <plan n> \"<goal>\"`",
        "Add the plan's phases in order with `journal plan phase <plan n> \"<title>\" --when \"<complete when>\"`, and `--checkpoint` where the user should look before it goes on",
        "File the tasks with `journal plan add <plan n> \"<title>\" --brief \"<done when>\"` and put each under its phase with `journal plan todos <plan n> <phase> <tasks>`; one task per step a person could check",
        "When every phase has its tasks, `journal plan ready <plan n>` and tell the user in one line it is ready on the plan page. Only they approve it; you are told when they do, and `journal plan start <plan n>` then, never before",
    ),
)
UPDATE_WRITING = Sequence(
    title="Writing an update",
    steps=(
        PLAIN_WRITING + "See what the update covers with `journal report changes`: the rows since the last update the user read, by section; read any row you do not remember before you sum it up",
        "Write the update with `journal report recap \"<one or two sentences>\"`: what got done and what waits on the user, in plain words; the journal puts the rows under it and docks it at the bottom of the chat. Take out what does not belong with `journal report drop <n>` and add a note with `journal report note <n> \"<text>\"`",
        "Tell the user in one short line that the update is docked above the chat, with the report's reference on a line of its own, like report 3; talk about the work, never about rows or commands",
    ),
)
INSTRUCTION_FILES_CHECK = Sequence(
    title="Checking the instruction files",
    steps=(
        PLAIN_WRITING + "Read AGENTS.md and CLAUDE.md at the project root and the journal's block at the head of each, narrowly: grep for the headings, then sed the sections you need; note every place where two of them tell an agent opposite things, with the file and line on both sides",
        "Write what you found as a report from a markdown file with `journal report create \"Instruction files checked\" --file <path>`: each contradiction with both sides quoted, and the fix you propose for it; never edit the files",
        "Tell the user in one short line how many contradictions you found, with the report's reference on a line of its own, like report 3; the user decides which fixes to make",
    ),
)
DOCUMENT_SORTING = Sequence(
    title="Filing a document that is already written",
    trigger_event="doc.created",
    steps=(
        "Check the document you filed reads as you meant: `journal doc show <doc n>` lists its sections, one for each ## heading of the file",
        "Tell the user in one or two plain lines what the document concludes, then its reference on a line of its own, like doc 41, never in backticks",
    ),
)
UPDATE_PHRASES = ("give me an update", "an update please", "any updates", "status update", "tldr", "tl;dr", "catch me up", "what happened since",
                "geef me een update", "update graag", "nog updates", "statusupdate", "stand van zaken", "praat me bij", "bijpraten", "wat is er gebeurd")
INSTRUCTION_CHECK_PHRASES = ("check the instruction files", "check agents.md", "check claude.md", "contradictions in the instructions",
                  "controleer de instructiebestanden", "controleer agents.md", "tegenstrijdigheden in de instructies")
SEQUENCE_PHRASES = {UPDATE_WRITING.title: UPDATE_PHRASES, INSTRUCTION_FILES_CHECK.title: INSTRUCTION_CHECK_PHRASES}
RETIRED = ("Sort dumped files",)
SHIPPED = (PLAN_BUILDING, UPDATE_WRITING, INSTRUCTION_FILES_CHECK, DOCUMENT_SORTING)
