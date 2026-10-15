from journal.models.sequence import Sequence

BUILDING_A_PLAN = Sequence(
    title="Building a plan",
    starts_on="plan.created",
    steps=(
        "Agree on the plan's goal: settle with the user what is true when the plan is done, and put it in the plan's brief with journal plan brief <plan n> \"<goal>\"",
        "Add the plan's phases in order with journal plan phase <plan n> \"<title>\" --when \"<complete when>\", and --checkpoint where the user should look before it goes on",
        "File the tasks with journal plan add <plan n> \"<title>\" --brief \"<done when>\" and put each under its phase with journal plan todos <plan n> <phase> <tasks>; one task per step a person could check",
        "When every phase has its tasks, journal plan ready <plan n> and tell the user in one line it is ready on the plan page. Only they approve it; you are told when they do, and journal plan start <plan n> then, never before",
    ),
)
SHIPPED = (BUILDING_A_PLAN,)
"""The sequences the journal ships: written at boot when a sequence of that title is not there yet, so a project may edit its copy."""
