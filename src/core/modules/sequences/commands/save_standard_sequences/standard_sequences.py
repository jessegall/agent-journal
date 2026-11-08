import json

from core.base.actor import CORE_ACTOR_ID
from core.modules.sequences.models.sequence import Sequence

PLAIN_WRITING = "Write in the user's own language in plain words. "
FILE_EDITS_BLOCKED: dict[str, object] = {"file_edits_allowed": False, "allowed_commands": []}
FILE_EDITS_OPEN: dict[str, object] = {"file_edits_allowed": True, "allowed_commands": []}
UPDATE_PHRASES = ("give me an update", "an update please", "any updates", "status update", "tldr", "tl;dr", "catch me up", "what happened since",
                  "geef me een update", "update graag", "nog updates", "statusupdate", "stand van zaken", "praat me bij", "bijpraten", "wat is er gebeurd")
INSTRUCTION_CHECK_PHRASES = ("check the instruction files", "check agents.md", "check claude.md", "contradictions in the instructions",
                             "controleer de instructiebestanden", "controleer agents.md", "tegenstrijdigheden in de instructies")


def row_trigger(event_name: str, **options: str) -> str:
    return json.dumps([{"trigger_type": "row", "event": event_name, **options}])


def phrase_triggers(phrases: tuple[str, ...]) -> str:
    return json.dumps([{"trigger_type": "phrase", "text": phrase} for phrase in phrases])


def guards(*steps: dict[str, object]) -> str:
    return json.dumps(steps)


PLAN_BUILDING = Sequence(
    creator_id=CORE_ACTOR_ID,
    title="Building a plan",
    triggers=row_trigger("plan.create", end_events="plan.ready,plan.approve,plan.start,plan.close"),
    step_guards=guards(FILE_EDITS_BLOCKED, FILE_EDITS_BLOCKED, FILE_EDITS_BLOCKED, FILE_EDITS_BLOCKED),
    steps=(
        f"Agree on the goal: {PLAIN_WRITING}When your job names a design document, read it whole and take the goal and the phases from it; otherwise settle with the user what is true when the plan is done. Put the goal in the plan's brief with `journal plan edit <plan n> --brief \"<goal>\"`",
        "Add the phases: Add the plan's phases in order with `journal phase make --plan <plan n> \"<title>\" --goal \"<what is true when done>\"`, and `--checkpoint` where the user should look before it goes on",
        "File the tasks: Split each phase into its real steps and file one task per step a person could check, each brief so complete that an agent on a cheaper model can carry it out without deciding anything itself, with `journal task make \"<title>\" --brief \"<brief>\"` and `journal phase place <task> --phase <phase>`. Write each brief so it can be carried out alone: the files to change, what already does part of it and is reused, the stories to write, the tests to run by name, and the proof that shows each point",
        "Mark the plan ready: When every phase has its tasks, `journal plan ready <plan n>` and tell the user in one line it is ready on the plan page. A phase with one task is refused until you give the reason one task is enough, with `--skip-guard plans.one-task-phase --skip-reason \"<why>\"`; otherwise split it. Only the user approves the plan; `journal plan start <plan n>` once they have, never before",
    ),
)
FUNCTIONAL_DESIGN = Sequence(
    creator_id=CORE_ACTOR_ID,
    title="Writing a functional design",
    triggers="[]",
    step_guards=guards(FILE_EDITS_BLOCKED, FILE_EDITS_BLOCKED, FILE_EDITS_BLOCKED, FILE_EDITS_BLOCKED),
    steps=(
        f"Investigate: {PLAIN_WRITING}Read the skill journal-functional-design. Find out what the project does today in this area and what already does part of the job, and note what you could not establish",
        "Write the user stories: Say what the application should do once this is done, as user stories: who does what and what they then see or get, including the cases that go wrong",
        "Add examples and phases: When the work is about code, add code examples of the shapes that matter, with the files they belong in. Lay out the phases in order, each with what is true when it is done",
        "File the document: File it with `journal doc make \"<title>\" --abstract \"<one line>\" --body - <<'EOF'`, the text, then a line `EOF`, and report its number in your last words so a planner can turn it into a plan",
    ),
)
UPDATE_WRITING = Sequence(
    creator_id=CORE_ACTOR_ID,
    title="Writing an update",
    triggers=phrase_triggers(UPDATE_PHRASES),
    step_guards=guards(FILE_EDITS_BLOCKED, FILE_EDITS_BLOCKED, FILE_EDITS_BLOCKED),
    steps=(
        f"See what the update covers: {PLAIN_WRITING}Look at what changed since the last update with `journal overview` and `journal task list`; read any row you do not remember before you sum it up",
        "Write the update: Write it with `journal report make \"Update\" --abstract \"<one or two sentences>\" --body \"<what got done and what waits on the user>\"`, in plain words",
        "Tell the user: Tell the user in one short line that the update is there, with its reference like report 3; talk about the work, never about rows or commands",
    ),
)
PLAN_REVIEW_APPLYING = Sequence(
    creator_id=CORE_ACTOR_ID,
    title="Applying a plan's reviews",
    triggers=json.dumps([*json.loads(row_trigger("review.assign")), *json.loads(row_trigger("plan.review"))]),
    step_guards=guards(FILE_EDITS_OPEN, FILE_EDITS_BLOCKED, FILE_EDITS_BLOCKED),
    steps=(
        f"Wait for the reviewers: {PLAIN_WRITING}Read the skill journal-plan-review-applying, then read what each reviewer finds as it comes back, noting every finding with the phase it belongs in; you may work on other files meanwhile",
        "Put the findings into the plan: Put each finding into the plan: a new task with `journal task make` placed with `journal phase place <task> --phase <phase>`, or a wider brief with `journal task edit <n> --brief \"<brief>\"`. File edits wait until this step is done",
        "Ready the plan: Compile the findings into one report with `journal report make \"<title>\" --abstract \"<what it found>\" --file <path>`. Then `journal plan reviewed <plan n>`, and tell the user in one or two plain lines what the reviews found, with the report's reference like report 3",
    ),
)
INSTRUCTION_FILES_CHECK = Sequence(
    creator_id=CORE_ACTOR_ID,
    title="Checking the instruction files",
    triggers=phrase_triggers(INSTRUCTION_CHECK_PHRASES),
    step_guards=guards(FILE_EDITS_BLOCKED, FILE_EDITS_OPEN, FILE_EDITS_BLOCKED),
    steps=(
        f"Read the instruction files: {PLAIN_WRITING}Read AGENTS.md and CLAUDE.md at the project root narrowly: grep for the headings, then read the sections you need; note every place where two of them tell an agent opposite things, with the file and line on both sides",
        "Write the report: Write what you found with `journal report make \"Instruction files checked\" --abstract \"<what it found>\" --file <path>`: each contradiction with both sides quoted, and the fix you propose; never edit the files",
        "Tell the user: Tell the user in one short line how many contradictions you found, with the report's reference like report 3; the user decides which fixes to make",
    ),
)
DOCUMENT_SORTING = Sequence(
    creator_id=CORE_ACTOR_ID,
    title="Filing a document that is already written",
    triggers=row_trigger("doc.create"),
    step_guards=guards(FILE_EDITS_BLOCKED, FILE_EDITS_BLOCKED),
    steps=(
        "Check the document: Check the document you filed reads as you intended: `journal doc show <doc n>` lists its sections, one for each ## heading of the file",
        "Tell the user: Tell the user in one or two plain lines what the document concludes, then its reference like doc 41, never in backticks",
    ),
)
TRANSCRIPT_HANDLING = Sequence(
    creator_id=CORE_ACTOR_ID,
    title="Handle a transcript",
    triggers=row_trigger("task.start", link_source="transcription"),
    step_guards=guards(FILE_EDITS_OPEN, FILE_EDITS_OPEN, FILE_EDITS_OPEN, FILE_EDITS_OPEN, FILE_EDITS_OPEN),
    steps=(
        "Read the transcript whole with journal transcription show <n>; your task's brief names its number. Note who spoke, what was decided, what stays open and each piece of work named.",
        "Write the summary with journal doc make \"<title>\" --abstract \"<one line>\" --body \"<text>\": who spoke, what was decided, what stays open. For a meeting, write it as meeting notes.",
        "Write what else it calls for: a task for each piece of work named with journal task make, a plan when that work has an order, a document for anything longer. Do not start the work here.",
        "Link every row you made to the transcription with journal transcription link <n> <model> <number>, such as doc 3.",
        "Tell the user in the chat what you made from the transcript, then close your task with journal task close <task> --outcome \"<the rows you made>\".",
    ),
)
STANDARD_SEQUENCES = (PLAN_BUILDING, PLAN_REVIEW_APPLYING, UPDATE_WRITING, INSTRUCTION_FILES_CHECK, DOCUMENT_SORTING, TRANSCRIPT_HANDLING, FUNCTIONAL_DESIGN)
STANDARD_SEQUENCE_FIELDS = ("steps", "triggers", "step_guards")
