from features.base import Behaviour, FeatureDetails, Line
from features.settings import Setting
from features.trigger import IDLE, MINUTES, Trigger, WORKED
from features.groups import Group


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

        journal work await "<what>" says you are waiting for something outside your hands,
        such as a long build or a run in Docker, in your own words, and the chat shows it. Say it
        once instead of writing another line each time nothing has changed. Working again clears
        it, and you are told that it was cleared; parking clears it too. While it stands you
        are told every five minutes (work.ask_awaiting_every) to check the thing you wait
        on and carry on or wait again.

        Auto mode is on by default: it is the user's word to work the list and decide without
        blocking questions, and switching it off stops the offers. The next ready row by priority is offered on idle
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
            title="Start the next to-do without asking",
            default=True,
            trigger=Trigger(on=IDLE),
        ),
        Behaviour(
            name="carry on",
            title="Tell a stopped agent to carry on",
            trigger=Trigger(every=10, unit=MINUTES),
        ),
    ]

    settings = [
        Setting(
            name="log_after",
            default=20,
            title="Block file changes after this many edits without a log entry",
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
            title="todo {{n}}, {{title}}, is still blocked - is it still?",
            brief="""
                it is blocked because: {{why}}. If it is not any more, journal todo unblock {{n}}. If it waits
                on a person or a decision, make it a question to them: journal todo ask {{n}} "<who decides
                what>", and the row waits on their answer. Otherwise tell the user in the chat what it waits
                on, in their terms, and propose how to clear it.
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
            name="nothing ready",
            reply_kept=True,
            title="nothing is ready: every open row waits",
            brief="""
                {{rows}}. For each that waits on a person or a decision, put it to them now with journal todo ask <n>
                "<who decides what>"; unblock any that can go on and work it. Stop only when each one waits on a question.
            """,
        ),
        Line(
            name="carry on",
            reply_kept=True,
            title="you stopped {{minutes}} minutes ago with work {{n}}, {{title}}, in hand",
            brief="""
                carry on with it now. If it waits on something outside your hands, say journal work await
                "<what you wait for>"; if it waits on the user, put the question on its row with journal todo ask
                and take the next ready row; if something else goes first, journal work park {{n}} "<why>".
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
            name="polling, no wake",
            title="you ran the same check {{times}} times in a row - {{command}}",
            brief="""
                if you are waiting for something to change, say journal work await "<what you wait for>" and end
                your turn: the journal types to you every five minutes to look again, and tells you when a
                background command you left running ends.
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
                look at the thing itself: the background shell's output, the process, the run's
                status. If it is still going, say journal work await "<what you wait for>" again and
                wait. If it finished or failed, journal work log what came of it and take the next
                step. Never wait for something you can do without.
            """,
        ),
    ]
