from features.base import FeatureDetails, Setting
from features.trigger import MINUTES, Trigger


class TicketsDetails(FeatureDetails):
    name = "tickets"
    when = "work is put on a board, arrives from an outside source, or a ticket is started"

    title = "Tickets"

    abstract = "A piece of work on a board, from the user, an agent or an outside source, run in an environment of its own"

    help = """
        journal ticket create "<the work>" --brief "<what is wanted>" --set board=<n> --set stage="<stage>" makes one, for
        the whole project. --set source="<source>" --set source_id="<its id>" marks where it came from: the same source and
        id again update that ticket rather than make another. owner names who answers for it; work_environment and plan are set
        when the ticket is started in an environment of its own.

        A started ticket closes only once its branch is merged into the project's branch: once a minute the journal closes
        every ticket whose branch is merged, in its board's done stage, and stops its agent with /exit. Its worktree stays.
        journal ticket complete <n> --yes closes one anyway.

        A message about a board asks for a ticket on it: draft it with journal ticket create "<the work>" --brief "<what is
        wanted>" --set board=<n> --set draft=true, after asking what is unclear and naming any ticket it depends on, then answer
        the message with a Confirm button (journal message create "<the draft, in a line>" --set buttons='[{"label": "Confirm",
        "type": "ticket", "n": <ticket>, "action": "confirm"}]'). A draft cannot start; only the user confirms it.

        journal ticket depend <n> <other> says ticket n waits on ticket other. From the agent it is only a proposal, shown on
        the card until the user accepts or declines it (journal ticket accept_dependencies <n> / decline_dependencies <n>, or a
        button for each); from the user it holds at once, and a declined proposal holds nothing. A ticket waiting on an open
        one queues instead of starting, and the minute sweep starts it once the other closes. A dependency that would make a
        cycle is refused.

        At most tickets.running tickets have an agent running at once; a ticket started beyond that waits queued, and the
        minute sweep starts it when one finishes.

        A rule, doc or tool written from a ticket's environment is held as a proposal for that ticket: it is closed and
        binds nothing until the ticket's branch is merged, when it is reopened; if the ticket closes unmerged it is deleted.
    """

    trigger = Trigger(every=1, unit=MINUTES)

    settings = [
        Setting(
            name="running",
            default=3,
            title="Tickets whose agents run at once",
            unit="tickets",
        ),
    ]
