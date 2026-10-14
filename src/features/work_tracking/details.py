from resources.base import ENVIRONMENT
from declaring.details import Behaviour, FeatureDetails, Line
from features.work_tracking.next import still_helped, still_next, still_stopped
from declaring.settings import Setting
from declaring.trigger import IDLE, MINUTES, Trigger, WORKED
from declaring.groups import Group

CHECK_IN = "check in"
CHECK_IN_MINUTES = 30

STARTED = ("work.created",)
MOVED = ("work.created", "work.updated", "work.completed")
ROW_CHANGED = ("todo.updated", "todo.completed", "todo.deleted")


class WorkDetails(FeatureDetails):
    explains = 'The agent records the work it starts, changes, and closes. You can follow its progress from the to-do.'
    name = "work_tracking"
    group = Group.WORK_TRACKING
    trigger_label = "Check for open work"
    skill_of = "todos"
    when = "you start, log, park, await or end work, or before the first write"

    title = "Work tracking"

    speaks_while_waiting = True

    abstract = """
        The agent must open work before it changes files. Work is linked to its to-do and keeps a
        log. After twenty edits without a log entry, file changes are blocked until it writes one.
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

        journal work await "<what>" says you are waiting for something outside your hands that will
        happen on its own and let the work go on,
        such as a long build or a run in Docker, in your own words, and the chat shows it. Say it
        once instead of writing another line each time nothing has changed. Working again clears
        it, and you are told that it was cleared; parking clears it too. While it stands you
        are told every five minutes (work.ask_awaiting_every) to check the thing you wait
        on and carry on or wait again. A shell command that only waits, such as sleep 30 or an until
        or while loop around sleep, is refused: say journal work await and stop, and a message or a
        report wakes you.

        Stopping with work in hand earns a nudge to carry on: with auto mode on at every stop the
        user did not make, else after five quiet minutes. When you are truly stuck, journal halt
        "<why>" says so and keeps the nudge quiet until your next tool use or prompt, which lift it.

        Auto mode is on by default: it is the user's word to work the list and decide without
        blocking questions, and switching it off stops the offers. The next ready row by priority is offered on idle
        while nothing is open. Stopping with work open while another row is ready earns the
        same offer: a row that waits on the user gets its question with todo ask and the next
        row is taken, so the agent stops only when nothing ready is left. When the work in hand
        waits on a helper or a subagent that is still working, the next ready row is offered at
        once, so the agent works on instead of sitting out the helper's turn. Five minutes quiet
        with unparked work open earns a direct question, are you still working? A row is
        ready when it is not blocked, waits on no open row or question, and its plan's phase
        is current.
    """

    aliases = (("auto", "auto"), "work")

    trigger = Trigger(on=WORKED)

    behaviours = [
        Behaviour(
            name="auto",
            title="Start the next to-do without asking",
            default=True,
            trigger=Trigger(on=IDLE),
            scope=ENVIRONMENT,
        ),
        Behaviour(
            name="carry on",
            title="Tell a stopped agent to carry on",
            trigger=Trigger(every=10, unit=MINUTES),
        ),
        Behaviour(
            name="nothing ready",
            title="Say when nothing can be taken",
            trigger=Trigger(every=10, unit=MINUTES),
        ),
        Behaviour(
            name=CHECK_IN,
            title="Check in when nothing has happened for a while",
            trigger=Trigger(every=CHECK_IN_MINUTES, unit=MINUTES),
        ),
    ]

    settings = [
        Setting(
            name="carry_on_after",
            default=15,
            title="With auto mode on, tell a stopped agent to carry on once the user has been quiet this long",
            unit="minutes",
        ),
        Setting(
            name="log_after",
            default=20,
            title="Block edits after this many with nothing logged",
            unit="edits",
        ),
        Setting(
            name="ask_awaiting_every",
            default=5,
            title="Ask what the agent is waiting on every",
            unit="minutes",
        ),
        Setting(
            name="ask_blocked_every",
            default=1,
            title="Recheck blocked to-dos after every",
            unit="closed to-dos",
        ),
        Setting(
            name="check_in_every",
            default=CHECK_IN_MINUTES,
            title="Check in with the agent after this long with nothing happening, whatever is open",
            unit="minutes",
        ),
        Setting(
            name="name_work_every",
            default=10,
            title="Remind the agent of its current work every",
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
            reply_kept=True,
            title="{{rows}} still blocked - is it still so?",
            brief="""
                blocked because: {{why}}. Gone: journal todo unblock <n>. Waits on a decision: journal todo ask <n> "<question>"
                --set options='[...]' --set pick=<n>. Otherwise say once in the chat what they wait on and how to clear it.
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
            brief="journal todo start {{n}} to take it, and in this mode {{taking}}",
            until=(*STARTED, *ROW_CHANGED),
            owed=still_next,
        ),
        Line(
            name="next while waiting",
            until=(*MOVED, *ROW_CHANGED),
            owed=still_next,
            title="auto mode is on and work {{work}} stands still while todo {{n}} is ready",
            brief="""
                decide what work {{work}} waits on yourself if you can; else journal todo ask on its row, end or park the work,
                and journal todo start {{n}}.
            """,
        ),
        Line(
            name="next while a helper works",
            until=(*MOVED, *ROW_CHANGED),
            owed=still_helped,
            title="{{who}} is working while work {{work}} waits, and todo {{n}} is ready",
            brief="""
                journal todo start {{n}} meanwhile, or journal work park {{work}} "<why>" first; the helper's report wakes you.
            """,
        ),
        Line(
            name="nothing ready",
            reply_kept=True,
            title="nothing is ready: every open row waits",
            brief="""
                {{rows}}. Put each decision to its person: journal todo ask <n> "<question>" --set options='[...]' --set pick=<n>.
                Work any that can go on.
            """,
        ),
        Line(
            name="carry on",
            reply_kept=True,
            until=MOVED,
            owed=still_stopped,
            title="you have work to do, work {{n}}, {{title}}: don't stop",
            brief="""
                carry on now. Waits on the user: journal todo ask on its row, then the next ready row. Waits on something that
                happens by itself: journal work await "<what>". Something else first: journal work park {{n}} "<why>".
                Truly stuck: journal halt "<why>", which keeps this quiet until your next tool use or prompt.
            """,
        ),
        Line(
            name="auto carry on",
            reply_kept=True,
            title="auto mode is on and you stopped - the user last wrote more than {{minutes}} minutes ago",
            brief="""
                carry on, or take the next ready row; only the user stops you. Waits on the user: journal todo ask on its row,
                then the next row.
            """,
        ),
        Line(
            name=CHECK_IN,
            reply_kept=True,
            title="nothing has happened for {{minutes}} minutes - is there anything left for you to do?",
            brief="""
                {{seen}}. Carry on, take the next ready row, or unblock one. All waiting on the user: journal todo ask on each.
                Nothing left: say so in one line.
            """,
        ),
        Line(
            name="polling",
            title="you ran the same check {{times}} times in a row - {{command}}",
            brief="""
                waiting for a change: journal work await "<what>" and end your turn; a background command says when it ends.
            """,
        ),
        Line(
            name="polling, no wake",
            title="you ran the same check {{times}} times in a row - {{command}}",
            brief="""
                waiting for a change: journal work await "<what>" and end your turn; you are asked to look again every five minutes.
            """,
        ),
        Line(
            name="wait cleared",
            title="your wait for {{awaiting}} is over, because you are working again",
            brief='say journal work await "<what you wait for>" again if you are still only waiting',
        ),
        Line(
            name="still awaiting",
            reply_kept=True,
            title="check {{awaiting}} now - you have waited {{minutes}} min",
            brief="""
                look at it: the output, the process, the run. Still going: journal work await "<what>" again. Done or failed:
                journal work log what came of it and take the next step.
            """,
        ),
    ]
