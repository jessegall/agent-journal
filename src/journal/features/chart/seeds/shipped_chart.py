from journal.features.chart.seeds.drawing import Drawing
from journal.features.seed import Seed
from journal.models.actor import Actor
from journal.models.chart import BASE, Chart
from journal.models.node import Node
from journal.models.node_kind import NodeKind
from journal.repositories.charts import NO, THEN, YES, Charts
from journal.repositories.settings import PROJECT, Settings

BASE_TITLE = "For every state"
IDLE_TITLE = "Idle"
WORKING_TITLE = "Working"
AWAITING_TITLE = "Awaiting a worker"
WAITING_TITLE = "Waiting on a question"
EXPECTING_TITLE = "Expecting something outside"
SEQUENCE_TITLE = "Running a sequence"
KEPT = " (kept from the older shape)"
"""What a retired per-event workflow with the user's edits is called: its triggers gone, its edits kept to be drawn into a state's workflow."""

NEW_MESSAGE = "[messages.new] new message {{row}}"
ONE_UNREAD = "[messages.new] new message {{unread_numbers}}"
SOME_UNREAD = "[messages.some] new messages {{unread_numbers}}"
MANY_UNREAD = "[messages.many] {{unread_count}} messages unread: journal message unread"
UNREAD_HELD = "your inbox is unread: {{unread_count}} waiting. journal message unread before any other write"
ANSWER = "[messages.answer] answer message {{owed}} before you do anything else. a reply with [!reply:N]; a face answers only a message of a few words"
ANSWER_HELD = "your tool calls are held: answer message {{owed}} first. a reply with [!reply:N] in words; a face answers only a message of a few words; only a journal command and a look at the message's own files go through"
PARKED = "parked tasks, still open: {{parked_tasks}}. journal task resume <n> picks one up; leave them parked only on purpose"
NEXT = "tasks are open, and auto mode is on: task {{next_task}} next: {{next_task_title}}. sure you want to stop? carry on with it, or journal stuck \"<why>\" if you are truly stuck"
PARKED_STILL = "[tasks.parked_still] task {{parked_n}}, {{parked_title}}, is still parked: can you continue it now?. it was parked because: {{parked_why}}. journal task resume {{parked_n}} picks it up again"
CHECK_IN = "[tasks.check_in] nothing has happened for half an hour: is there anything left for you to do?. carry on, take the next task, or say so in one line"
LOG_OVERDUE = "{{task_edits}} edits since you logged {{task}}. {{log_command}} \"<what was decided or done, and why>\" before any other write"
LOG_SOON = "[tasks.log_soon] {{task_edits}} edits since you logged {{task}}: say where it stands. {{log_command}} \"<where it stands>\""
IN_HAND = "[tasks.in_hand] {{task}} in hand, {{task_edits}} edits. if this is not what you are doing, finish it or park it and start the work you are on"
CARRY_ON = "[tasks.carry_on] {{task}} is in hand, {{logged}}: carry on. journal stuck \"<why>\" if you are truly stuck"
CARRY_ON_LOG = "[tasks.carry_on_log] {{task}} is in hand, {{logged}}: carry on. log where it stands first, then continue; journal stuck \"<why>\" if you are truly stuck"
STILL_OPEN = "[tasks.open] {{task}} is still open: log where it stands or finish it"
REPORTED = "[workers.reported] worker {{worker_n}}, {{worker_name}}, reported in the chat"
STOPPED = "[workers.stopped] worker {{worker_n}}, {{worker_name}}, stopped before it reported"
RETURNED = "[workers.returned] what you waited on came back: carry on"
ANSWERED = "question {{question_n}} is answered. journal question show {{question_n}} reads it whole, with the messages linked to it; act on the answer"
CHECK_AWAITED = "[tasks.check_awaited] check {{awaited}} now: you have waited {{quiet_minutes}} min. look at it. Still going: journal await again. Done or failed: log what came of it and take the next step"
STEP = "[sequences.step] sequence {{sequence_n}}, step {{sequence_step}}: {{sequence_step_text}}. journal sequence next when it is done"
LISTENERS_OFF = "listeners.off"
"""The setting naming the listeners in code that run nowhere: a shipped workflow that carries one's conduct adds it when the workflow is made."""


class ShippedChart(Seed):
    """The workflows the journal ships, one per state and one for what every state shares: each is made at boot where it is absent and left alone where it stands, edited or not. A workflow of the older shape, bound to one event, retires at boot: taken out when unedited, kept without its triggers when the user edited it. A reset redraws one by its state."""

    def __init__(self, charts: Charts, settings: Settings) -> None:
        self.charts, self.settings = charts, settings
        self.drawings = {
            BASE: Drawing(BASE_TITLE, self.draw_base, ("InboxOnArrival", "InboxAtStart", "InboxAtPrompt", "InboxAtStop", "HoldUnread", "HoldUnanswered")),
            "idle": Drawing(IDLE_TITLE, self.draw_idle, ("AskAfterParked", "CheckIn")),
            "working": Drawing(WORKING_TITLE, self.draw_working, ("LogCadence",)),
            "awaiting": Drawing(AWAITING_TITLE, self.draw_awaiting, ("ReleaseAwaiting",)),
            "waiting": Drawing(WAITING_TITLE, self.draw_waiting, ("ReleaseWaiting",)),
            "expecting": Drawing(EXPECTING_TITLE, self.draw_expecting),
            "running_sequence": Drawing(SEQUENCE_TITLE, self.draw_running_sequence),
        }
        """The states the journal ships a workflow for, the base first, each with its drawing."""

    def run(self) -> None:
        by = Actor.system()
        self.retire_the_older_shape(by)
        for state, drawing in self.drawings.items():
            if self.charts.for_state(state):
                continue
            drawing.draw(self.charts.save(Chart(title=drawing.title, shipped=True, state=state), by))
            self.take_over(drawing.replaces, by)

    def retire_the_older_shape(self, by: Actor) -> None:
        """A shipped workflow bound to one event goes: whole when every node is still as shipped, else its triggers alone, so the user's edits stay to be drawn into a state's workflow."""
        for chart in [c for c in self.charts.shipped() if not c.bound_to_a_state]:
            nodes = self.charts.nodes_of(chart)
            if all(node.shipped for node in nodes):
                self.charts.remove(chart, by)
                continue
            for node in [n for n in nodes if n.kind == NodeKind.TRIGGER]:
                self.charts.remove_node(node, by)
            self.charts.save(chart.with_(shipped=False, event="", title=chart.title + KEPT), by)

    def take_over(self, listeners: tuple[str, ...], by: Actor) -> None:
        """The listeners a new shipped workflow carries the conduct of are switched off, so a line is said once."""
        off = list(self.settings.get(PROJECT, LISTENERS_OFF, []) or [])
        missing = [name for name in listeners if name not in off]
        if missing:
            self.settings.set(LISTENERS_OFF, off + missing, by)

    def reset(self, chart: Chart, by: Actor) -> Chart:
        """A shipped workflow as shipped again: every node and line gone, its state's drawing drawn anew, one more revision."""
        drawing = self.drawings[chart.state]
        for node in self.charts.nodes_of(chart):
            self.charts.remove_node(node, by)
        drawing.draw(chart)
        self.take_over(drawing.replaces, by)
        return self.charts.save(chart.saved_again().with_(title=drawing.title), by)

    def node(self, chart: Chart, kind: NodeKind, key: str, text: str = "", x: int = 0, y: int = 0) -> Node:
        return self.charts.add_node(chart, Node(kind=kind, key=key, text=text, x=x, y=y, shipped=True), Actor.system())

    def line(self, source: Node, target: Node, port: str) -> None:
        self.charts.connect(source, target, port, Actor.system())

    def draw_base(self, chart: Chart) -> None:
        """What every state shares: a message the user leaves named by number; the inbox named at a start, a prompt and a stop; at a tool use the inbox every few uses and the write held after enough namings, and a message read and unanswered held, a journal command and a look at its files going through."""
        arrives = self.node(chart, NodeKind.TRIGGER, "messages.created", x=80, y=0)
        by_user = self.node(chart, NodeKind.CHECK, "message_by_user", x=80, y=92)
        named = self.node(chart, NodeKind.ACTION, "type", NEW_MESSAGE, x=80, y=184)
        self.line(arrives, by_user, THEN)
        self.line(by_user, named, YES)
        for column, key in ((320, "session_started"), (560, "prompt_submitted"), (800, "idle")):
            self.draw_inbox(chart, self.node(chart, NodeKind.TRIGGER, key, x=column, y=0), x=column, y=92)
        tool = self.node(chart, NodeKind.TRIGGER, "tool_starting", x=1040, y=0)
        unread = self.node(chart, NodeKind.CHECK, "unread_messages", x=1040, y=92)
        reminders = self.node(chart, NodeKind.CHECK, "unread_reminders_over", "messages.hold_after_reminders", x=1040, y=184)
        writes = self.node(chart, NodeKind.CHECK, "tool_writes", x=960, y=276)
        hold_unread = self.node(chart, NodeKind.ACTION, "hold", UNREAD_HELD, x=960, y=368)
        every = self.node(chart, NodeKind.CHECK, "tool_uses_since_unread_every", "messages.remind_every", x=1120, y=368)
        self.line(tool, unread, THEN)
        self.line(unread, reminders, YES)
        self.line(reminders, writes, YES)
        self.line(writes, hold_unread, YES)
        self.line(writes, every, NO)
        self.line(reminders, every, NO)
        self.draw_inbox(chart, every, x=1120, y=460)
        owed = self.node(chart, NodeKind.CHECK, "unanswered_messages", x=1360, y=92)
        journal = self.node(chart, NodeKind.CHECK, "journal_command", x=1360, y=184)
        theirs = self.node(chart, NodeKind.CHECK, "tool_reads_their_files", x=1360, y=276)
        held_after = self.node(chart, NodeKind.CHECK, "tool_uses_since_read_over", "messages.hold_after", x=1360, y=368)
        hold_owed = self.node(chart, NodeKind.ACTION, "hold", ANSWER_HELD, x=1280, y=460)
        ask_after = self.node(chart, NodeKind.CHECK, "tool_uses_since_read_over", "messages.nudge_after", x=1440, y=460)
        say_owed = self.node(chart, NodeKind.ACTION, "say", ANSWER, x=1440, y=552)
        self.line(tool, owed, THEN)
        self.line(owed, journal, YES)
        self.line(journal, theirs, NO)
        self.line(theirs, held_after, NO)
        self.line(held_after, hold_owed, YES)
        self.line(held_after, ask_after, NO)
        self.line(ask_after, say_owed, YES)

    def draw_inbox(self, chart: Chart, after: Node, x: int, y: int) -> None:
        """What waits unread, named from the node given: one message by its number, a few by theirs, more than three by their count."""
        unread = self.node(chart, NodeKind.CHECK, "unread_messages", x=x, y=y)
        many = self.node(chart, NodeKind.CHECK, "unread_over", "4", x=x, y=y + 92)
        say_many = self.node(chart, NodeKind.ACTION, "say", MANY_UNREAD, x=x - 160, y=y + 184)
        some = self.node(chart, NodeKind.CHECK, "unread_over", "2", x=x, y=y + 184)
        say_some = self.node(chart, NodeKind.ACTION, "say", SOME_UNREAD, x=x - 160, y=y + 276)
        say_one = self.node(chart, NodeKind.ACTION, "say", ONE_UNREAD, x=x, y=y + 276)
        self.line(after, unread, THEN if after.kind != NodeKind.CHECK else YES)
        self.line(unread, many, YES)
        self.line(many, say_many, YES)
        self.line(many, some, NO)
        self.line(some, say_some, YES)
        self.line(some, say_one, NO)

    def draw_idle(self, chart: Chart) -> None:
        """An agent at rest: at a stop, parked tasks hold it in any mode and in auto mode the next open task holds it; as the clock ticks, the parked ask after a minute and the check-in after half an hour in auto mode."""
        stop = self.node(chart, NodeKind.TRIGGER, "idle", x=160, y=0)
        parked = self.node(chart, NodeKind.CHECK, "parked_tasks", x=160, y=92)
        say_parked = self.node(chart, NodeKind.ACTION, "block_stop", PARKED, x=0, y=184)
        auto = self.node(chart, NodeKind.CHECK, "auto_mode", x=160, y=276)
        open_ = self.node(chart, NodeKind.CHECK, "open_tasks", x=160, y=368)
        hold_stop = self.node(chart, NodeKind.ACTION, "block_stop", NEXT, x=160, y=460)
        self.line(stop, parked, THEN)
        self.line(parked, say_parked, YES)
        self.line(parked, auto, NO)
        self.line(auto, open_, YES)
        self.line(open_, hold_stop, YES)
        tick = self.node(chart, NodeKind.TRIGGER, "ticked", x=560, y=0)
        parked_tick = self.node(chart, NodeKind.CHECK, "parked_tasks", x=440, y=92)
        quiet_a_minute = self.node(chart, NodeKind.CHECK, "quiet_for_over", "60", x=440, y=184)
        ask_parked = self.node(chart, NodeKind.ACTION, "type", PARKED_STILL, x=440, y=276)
        auto_tick = self.node(chart, NodeKind.CHECK, "auto_mode", x=680, y=92)
        quiet_half_an_hour = self.node(chart, NodeKind.CHECK, "quiet_for_over", "1800", x=680, y=184)
        check_in = self.node(chart, NodeKind.ACTION, "type", CHECK_IN, x=680, y=276)
        self.line(tick, parked_tick, THEN)
        self.line(parked_tick, quiet_a_minute, YES)
        self.line(quiet_a_minute, ask_parked, YES)
        self.line(tick, auto_tick, THEN)
        self.line(auto_tick, quiet_half_an_hour, YES)
        self.line(quiet_half_an_hour, check_in, YES)

    def draw_working(self, chart: Chart) -> None:
        """A task in hand: at a tool use that writes the task is named every so many edits, the log asked for at the first threshold and the write held when the log is overdue; a stop and a session starting again are told to carry on, with a log asked for when the last is stale; a quarter of an hour's quiet is told the task is still open."""
        tool = self.node(chart, NodeKind.TRIGGER, "tool_starting", x=160, y=0)
        writes = self.node(chart, NodeKind.CHECK, "tool_writes", x=160, y=92)
        overdue = self.node(chart, NodeKind.CHECK, "edits_since_log_over", "tasks.log_after", x=160, y=184)
        hold_log = self.node(chart, NodeKind.ACTION, "hold", LOG_OVERDUE, x=0, y=276)
        first = self.node(chart, NodeKind.CHECK, "edits_since_log_at", "tasks.first_nudge_after", x=240, y=276)
        say_soon = self.node(chart, NodeKind.ACTION, "say", LOG_SOON, x=160, y=368)
        named = self.node(chart, NodeKind.CHECK, "edits_since_log_every", "tasks.name_every", x=320, y=368)
        say_in_hand = self.node(chart, NodeKind.ACTION, "say", IN_HAND, x=320, y=460)
        self.line(tool, writes, THEN)
        self.line(writes, overdue, YES)
        self.line(overdue, hold_log, YES)
        self.line(overdue, first, NO)
        self.line(first, say_soon, YES)
        self.line(first, named, NO)
        self.line(named, say_in_hand, YES)
        for column, key in ((640, "idle"), (960, "session_started")):
            trigger = self.node(chart, NodeKind.TRIGGER, key, x=column, y=0)
            stale = self.node(chart, NodeKind.CHECK, "log_stale_over", "600", x=column, y=92)
            carry_on_log = self.node(chart, NodeKind.ACTION, "say", CARRY_ON_LOG, x=column - 80, y=184)
            carry_on = self.node(chart, NodeKind.ACTION, "say", CARRY_ON, x=column + 80, y=184)
            self.line(trigger, stale, THEN)
            self.line(stale, carry_on_log, YES)
            self.line(stale, carry_on, NO)
        tick = self.node(chart, NodeKind.TRIGGER, "ticked", x=1280, y=0)
        quiet = self.node(chart, NodeKind.CHECK, "quiet_for_over", "900", x=1280, y=92)
        still_open = self.node(chart, NodeKind.ACTION, "say", STILL_OPEN, x=1280, y=184)
        self.line(tick, quiet, THEN)
        self.line(quiet, still_open, YES)

    def draw_awaiting(self, chart: Chart) -> None:
        """An agent awaiting workers: one reporting or stopping is told, and the agent goes back to its work when its last worker is back."""
        worker = self.node(chart, NodeKind.TRIGGER, "workers.updated", x=400, y=0)
        for column, came, told in ((240, "worker_reported", REPORTED), (560, "worker_stopped", STOPPED)):
            now = self.node(chart, NodeKind.CHECK, came, x=column, y=92)
            awaited = self.node(chart, NodeKind.CHECK, "agent_awaits_the_worker", x=column, y=184)
            tell = self.node(chart, NodeKind.ACTION, "type", told, x=column, y=276)
            last = self.node(chart, NodeKind.CHECK, "last_worker_back", x=column, y=368)
            back = self.node(chart, NodeKind.ACTION, "release", RETURNED, x=column, y=460)
            self.line(worker, now, THEN)
            self.line(now, awaited, YES)
            self.line(awaited, tell, YES)
            self.line(tell, last, THEN)
            self.line(last, back, YES)

    def draw_waiting(self, chart: Chart) -> None:
        """An agent waiting on a question: when it is answered the agent goes back to its work, told how to read the answer."""
        question = self.node(chart, NodeKind.TRIGGER, "questions.updated", x=400, y=0)
        answered = self.node(chart, NodeKind.CHECK, "question_answered", x=400, y=92)
        waits = self.node(chart, NodeKind.CHECK, "agent_waits_on_the_question", x=400, y=184)
        back = self.node(chart, NodeKind.ACTION, "release", ANSWERED, x=400, y=276)
        self.line(question, answered, THEN)
        self.line(answered, waits, YES)
        self.line(waits, back, YES)

    def draw_expecting(self, chart: Chart) -> None:
        """An agent awaiting something outside: after five quiet minutes it is told to check it, with what it awaits and how long; the wait lifts on its own next tool use, which is the state's move."""
        tick = self.node(chart, NodeKind.TRIGGER, "ticked", x=400, y=0)
        quiet = self.node(chart, NodeKind.CHECK, "quiet_for_over", "300", x=400, y=92)
        check = self.node(chart, NodeKind.ACTION, "say", CHECK_AWAITED, x=400, y=184)
        self.line(tick, quiet, THEN)
        self.line(quiet, check, YES)

    def draw_running_sequence(self, chart: Chart) -> None:
        """An agent working through a sequence: a stop is told the step in hand; stepping on is the state's move."""
        stop = self.node(chart, NodeKind.TRIGGER, "idle", x=400, y=0)
        step = self.node(chart, NodeKind.ACTION, "say", STEP, x=400, y=92)
        self.line(stop, step, THEN)
