from journal.models.sequence import Sequence

BUILDING_A_PLAN = Sequence(
    title="Building a plan",
    starts_on="plan.created",
    steps=(
        "Agree on the plan's goal: settle with the user what is true when the plan is done, and put it in the plan's brief with `journal plan brief <plan n> \"<goal>\"`",
        "Add the plan's phases in order with `journal plan phase <plan n> \"<title>\" --when \"<complete when>\"`, and `--checkpoint` where the user should look before it goes on",
        "File the tasks with `journal plan add <plan n> \"<title>\" --brief \"<done when>\"` and put each under its phase with `journal plan todos <plan n> <phase> <tasks>`; one task per step a person could check",
        "When every phase has its tasks, `journal plan ready <plan n>` and tell the user in one line it is ready on the plan page. Only they approve it; you are told when they do, and `journal plan start <plan n>` then, never before",
    ),
)
WRITING_AN_UPDATE = Sequence(
    title="Writing an update",
    steps=(
        "Find what changed since the user last had an update: `journal task list` for what was done and is under way, `journal plan list`, the messages answered, and `git log --oneline -15`; read any row you do not remember before you sum it up",
        "Write the update as a report from a markdown file with `journal report create \"Update <date>\" --file <path> --about <the rows it covers>`: what got done, what is under way, what waits on the user, each in one or two plain sentences",
        "Tell the user in one short line that the update is on the reports page, with the report's reference on a line of its own, like report 3; talk about the work, never about rows or commands",
    ),
)
UPDATE_WORDS = ("give me an update", "an update please", "any updates", "status update", "tldr", "tl;dr", "catch me up", "what happened since",
                "geef me een update", "update graag", "nog updates", "statusupdate", "stand van zaken", "praat me bij", "bijpraten", "wat is er gebeurd")
"""The words that start Writing an update, as a shipped trigger."""
SHIPPED = (BUILDING_A_PLAN, WRITING_AN_UPDATE)
"""The sequences the journal ships: written at boot when a sequence of that title is not there yet, and brought up to date while nobody but the journal has changed it, so a project may edit its copy."""
