from features.base import Behaviour, FeatureDetails, Line
from features.settings import Setting
from features.trigger import IDLE, Trigger, WORKED


class WorkDetails(FeatureDetails):
    name = "work_tracking"
    when = "you start, log, park, await or end work, or before the first write"

    title = "Work tracking"

    speaks_while_waiting = True

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
        when nothing stops the work but something else goes first by choice. What cannot go
        ahead until something happens is blocked, not parked: journal todo after, todo ask or
        todo block on its row. Never park to wait for an answer you could carry on without.

        journal work await "<what>" says you are waiting for something outside your hands,
        such as a long build or a run in Docker, in your own words, and the chat shows it. Say it
        once instead of writing another line each time nothing has changed. Working again clears
        it, and you are told that it was cleared; parking clears it too. While it stands you
        are told every five minutes (work.ask_awaiting_every) to check the thing you wait
        on and carry on or wait again.

        Auto mode is off by default: turning it on is the user's word to work the list and
        decide without blocking questions. The next ready row by priority is offered on idle
        while nothing is open. Stopping with work open while another row is ready earns the
        same offer: a row that waits on the user gets its question with todo ask and the next
        row is taken, so the agent stops only when nothing ready is left. Five minutes quiet
        with unparked work open earns a direct question, are you still working? A row is
        ready when it is not blocked, waits on no open row or question, and its plan's phase
        is current.
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
            default=5,
            title="Have the agent check what it waits on every",
            unit="minutes",
        ),
        Setting(
            name="ask_blocked_every",
            default=1,
            title="Ask whether a blocked to-do is still blocked every",
            unit="closed to-dos",
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
            name="unblocked",
            title="todo {{n}}, {{title}}, is unblocked - {{closed}} closed",
            brief="journal todo start {{n}} when it is next",
        ),
        Line(
            name="still blocked",
            title="todo {{n}}, {{title}}, is still blocked - is it still?",
            brief="""
                it is blocked because: {{why}}. If it is not any more, journal todo unblock {{n}}. If it
                is, tell the user in the chat what it waits on, in their terms, and propose how to clear it.
            """,
        ),
        Line(
            name="open",
            title="work {{n}} is still open",
            brief='end it or park it before you stop: journal work end {{n}} --how "<what landed>", or journal work park {{n}} "<why it waits>"',
            while_waiting=False,
        ),
        Line(
            name="unlogged",
            title="work {{n}} is still open, with nothing logged",
            brief="""
                journal work log {{n}} "<what was decided or done, and why>" — then journal work
                end {{n}} --how "<what landed>", or journal work park {{n}} "<why it waits>"
            """,
            while_waiting=False,
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
            name="next while waiting",
            title="auto mode is on and work {{work}} stands still while todo {{n}} is ready",
            brief="""
                if work {{work}} waits on the user, decide it yourself when you can; otherwise put the question on
                its row with journal todo ask, end or park the work, and start todo {{n}}. Stop only when nothing
                ready is left.
            """,
        ),
        Line(
            name="polling",
            title="you ran the same check {{times}} times in a row - {{command}}",
            brief="""
                if you are waiting for something to change, say journal work await "<what you wait for>" and end
                your turn: you are asked to look again every five minutes, and a background command tells you
                itself when it ends. Keep checking only if each look moves the work on.
            """,
        ),
        Line(
            name="wait cleared",
            title="your wait for {{awaiting}} is over, because you are working again",
            brief='say journal work await "<what you wait for>" again if you are still only waiting',
        ),
        Line(
            name="still awaiting",
            title="check {{awaiting}} now - you have waited {{minutes}} min",
            brief="""
                look at the thing itself: the background shell's output, the process, the run's
                status. If it is still going, say journal work await "<what you wait for>" again and
                wait. If it finished or failed, journal work log what came of it and take the next
                step. Never wait for something you can do without.
            """,
        ),
    ]
