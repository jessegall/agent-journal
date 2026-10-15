from journal.models.sequence import Sequence

BUILDING_A_PLAN = Sequence(
    title="Building a plan",
    starts_on="plan.created",
    steps=(
        "Agree on the plan's goal: settle with the user what is true when the plan is done, and put it in the plan's brief",
        "Add the plan's tasks in order with journal plan add <plan n> \"<task title>\" --brief \"<what done looks like>\", one task per step a person could check",
        "Show the plan with journal plan show <plan n> and tell the user in the chat it is ready to read on the plan page, in one line",
        "Wait for the user's word: only they approve it, and journal plan start <plan n> on their word, never before",
    ),
)
SHIPPED = (BUILDING_A_PLAN,)
"""The sequences the journal ships: written at boot when a sequence of that title is not there yet, so a project may edit its copy."""
