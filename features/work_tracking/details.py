from features.base import Behaviour, FeatureDetails, Line
from features.settings import Setting
from features.trigger import IDLE, Trigger, WORKED


class WorkDetails(FeatureDetails):
    name = "work_tracking"

    title = "Work tracking"

    abstract = """
        A write is refused until work is open; work started for a to-do is linked to it, its log
        is kept, twenty edits without an entry hold the writes, and parked work is set aside
        until the next log entry
    """

    help = """
        One piece of work is in hand at a time: starting another is refused until this one is
        ended or parked. Take a row with journal todo start <n>, or start work of its own with
        journal work start "<title>"; log each decision and turn with journal work log
        "<message>" (work.log_after, 20 edits without an entry holds the writes); end it with
        journal work end <n> --how "<what landed>", and --set todo=<n> closes the row with it.

        journal work park "<why>" sets it aside with no clock — it stays open, stops being
        nudged and stops holding writes, and journal work resume <n> picks it up again. Park
        when you are stuck or when something else has to happen first; never to wait for an
        answer you could carry on without, because under auto the list stops.

        journal work await "<what>" says the agent is waiting for something, in its own words,
        and the chat shows it; a log entry or parking clears it, and while it stands the agent
        is asked every minute (work.ask_awaiting_every) whether the wait still holds.

        Auto mode is off by default: turning it on is the user's word to work the list and
        decide without blocking questions. The next ready row by priority is offered on idle
        while nothing is open; five minutes quiet with unparked work open earns a direct
        question, are you still working? A row is ready when it is not blocked, waits on no
        open row or question, and its plan's phase is current.
    """

    aliases = (("auto", "auto"), "work")

    trigger = Trigger(on=WORKED)

    behaviours = [
        Behaviour(
            name="auto",
            title="Work the list without asking",
            abstract="The next ready row is offered on idle, and blocking questions are refused",
            default=False,
            trigger=Trigger(on=IDLE),
        ),
    ]

    settings = [
        Setting(
            name="log_after",
            default=20,
            title="Hold the writes after this many edits without a log entry",
            unit="edits",
        ),
        Setting(
            name="ask_awaiting_every",
            default=1,
            title="Ask the agent whether it is still waiting every",
            unit="minutes",
        ),
        Setting(
            name="name_work_every",
            default=10,
            title="Name the work in hand every",
            unit="edits",
        ),
    ]

    lines = [
        Line(
            name="parked",
            title="work {{n}}, {{title}}, is still parked{{more}} - can you continue it now?",
            brief="it was parked because: {{why}}. journal work resume {{n}} picks it up again.",
        ),
        Line(
            name="open",
            title="work {{n}} is still open",
            brief='end it or park it before you stop: journal work end {{n}} --how "<what landed>", or journal work park {{n}} "<why it waits>"',
        ),
        Line(
            name="unlogged",
            title="work {{n}} is still open, with nothing logged",
            brief="""
                journal work log {{n}} "<what was decided or done, and why>" — then journal work
                end {{n}} --how "<what landed>", or journal work park {{n}} "<why it waits>"
            """,
        ),
        Line(
            name="in hand",
            title="work {{n}} in hand — {{title}}",
            brief="if this is not what you are doing, end it or park it and start the work you are in",
        ),
        Line(
            name="log held",
            title='{{edits}} edits since work {{n}} was last logged: journal work log "<what was decided or done, and why>" before any other write',
        ),
        Line(
            name="undeclared held",
            title='nothing is open, so this write would not be filed: journal work start "<the work>" first',
        ),
        Line(
            name="next",
            title="todo {{n}} next",
        ),
        Line(
            name="still awaiting",
            title="you said you are waiting for {{what}}, {{minutes}} min ago - is that still true?",
            brief="""
                if it is, say so with journal work await "<what you wait for>"; if not, carry on:
                journal work log what came of it and take the next step. Never wait for something
                you can do without, and park a to-do for anything that has to wait longer.
            """,
        ),
    ]
