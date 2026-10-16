from journal.features.chart.seeds.drawing import Drawing
from journal.features.seed import Seed
from journal.models.actor import Actor
from journal.models.chart import Chart
from journal.models.node import Node
from journal.models.node_kind import NodeKind
from journal.repositories.charts import NO, THEN, YES, Charts
from journal.repositories.settings import PROJECT, Settings

TITLE = "Agent stops"
MESSAGE_TITLE = "Message arrives"
NEW_MESSAGE = "[messages.new] new message {{row}}"
PROMPT_TITLE = "Prompt sent"
ONE_UNREAD = "[messages.new] new message {{unread_numbers}}"
SOME_UNREAD = "[messages.some] new messages {{unread_numbers}}"
MANY_UNREAD = "[messages.many] {{unread_count}} messages unread: journal message unread"
TOOL_TITLE = "Tool about to run"
UNREAD_HELD = "your inbox is unread: {{unread_count}} waiting. journal message unread before any other write"
ANSWER = "[messages.answer] answer message {{owed}} before you do anything else. a reply with [!reply:N]; a face answers only a message of a few words"
ANSWER_HELD = "your tool calls are held: answer message {{owed}} first. a reply with [!reply:N] in words; a face answers only a message of a few words; only a journal command and a look at the message's own files go through"
LOG_OVERDUE = "{{task_edits}} edits since you logged {{task}}. {{log_command}} \"<what was decided or done, and why>\" before any other write"
LOG_SOON = "[tasks.log_soon] {{task_edits}} edits since you logged {{task}}: say where it stands. {{log_command}} \"<where it stands>\""
IN_HAND = "[tasks.in_hand] {{task}} in hand, {{task_edits}} edits. if this is not what you are doing, finish it or park it and start the work you are on"
LISTENERS_OFF = "listeners.off"
"""The setting naming the listeners in code that run nowhere: a shipped workflow that carries one's conduct adds it when the workflow is made."""
OLD_TITLE = "The journal's conduct"
"""The shipped workflow's name before it was named after its event; a journal still carrying it is renamed at boot."""
PARKED = "parked tasks, still open: {{parked_tasks}}. journal task resume <n> picks one up; leave them parked only on purpose"
NEXT = "tasks are open, and auto mode is on: task {{next_task}} next: {{next_task_title}}. sure you want to stop? carry on with it, or journal stuck \"<why>\" if you are truly stuck"


class ShippedChart(Seed):
    """The workflows the journal ships, one per event: each is made at boot where it is absent and left alone where it stands, edited or not, so a journal that upgrades gets the new ones and keeps its own. A reset redraws one by its event."""

    def __init__(self, charts: Charts, settings: Settings) -> None:
        self.charts, self.settings = charts, settings
        self.drawings = {
            "idle": Drawing(TITLE, self.draw_stop),
            "messages.created": Drawing(MESSAGE_TITLE, self.draw_message, ("InboxOnArrival",)),
            "prompt_submitted": Drawing(PROMPT_TITLE, self.draw_prompt, ("InboxAtPrompt",)),
            "tool_starting": Drawing(TOOL_TITLE, self.draw_tool, ("HoldUnread", "HoldUnanswered", "LogCadence")),
        }
        """The events the journal ships a workflow for, each with its drawing."""

    def run(self) -> None:
        by = Actor.system()
        self.claim_legacy(by)
        for event, drawing in self.drawings.items():
            if self.charts.shipped_on(event):
                continue
            drawing.draw(self.charts.save(Chart(title=drawing.title, shipped=True, event=event), by))
            self.take_over(drawing.replaces, by)

    def take_over(self, listeners: tuple[str, ...], by: Actor) -> None:
        """The listeners a new shipped workflow carries the conduct of are switched off, so a line is said once."""
        off = list(self.settings.get(PROJECT, LISTENERS_OFF, []) or [])
        missing = [name for name in listeners if name not in off]
        if missing:
            self.settings.set(LISTENERS_OFF, off + missing, by)

    def claim_legacy(self, by: Actor) -> None:
        """A journal from before workflows were marked: its first chart carried the shipped stop rules and is the shipped one on that event."""
        for chart in self.charts.all():
            if chart.shipped:
                continue
            shipped_nodes = [n for n in self.charts.nodes_of(chart) if n.shipped]
            if not shipped_nodes:
                continue
            trigger = next((n.key for n in shipped_nodes if n.kind == NodeKind.TRIGGER), "idle")
            title = self.drawings[trigger].title if chart.title == OLD_TITLE and trigger in self.drawings else chart.title
            self.charts.save(chart.with_(shipped=True, event=trigger, title=title), by)

    def reset(self, chart: Chart, by: Actor) -> Chart:
        """A shipped workflow as shipped again: every node and line gone, its event's drawing drawn anew, one more revision."""
        drawing = self.drawings[chart.event]
        for node in self.charts.nodes_of(chart):
            self.charts.remove_node(node, by)
        drawing.draw(chart)
        return self.charts.save(chart.saved_again().with_(title=drawing.title), by)

    def draw_prompt(self, chart: Chart) -> None:
        """Today's conduct when a prompt is sent: what waits unread is named by number, one message by its number, a few by theirs, more than three by their count."""
        by = Actor.system()
        node = lambda kind, key, text="", x=0, y=0: self.charts.add_node(chart, Node(kind=kind, key=key, text=text, x=x, y=y, shipped=True), by)
        prompt = node(NodeKind.TRIGGER, "prompt_submitted", x=400, y=0)
        unread = node(NodeKind.CHECK, "unread_messages", x=400, y=92)
        many = node(NodeKind.CHECK, "unread_over", "4", x=400, y=184)
        say_many = node(NodeKind.ACTION, "say", MANY_UNREAD, x=160, y=276)
        some = node(NodeKind.CHECK, "unread_over", "2", x=400, y=276)
        say_some = node(NodeKind.ACTION, "say", SOME_UNREAD, x=160, y=368)
        say_one = node(NodeKind.ACTION, "say", ONE_UNREAD, x=400, y=368)
        self.charts.connect(prompt, unread, THEN, by)
        self.charts.connect(unread, many, YES, by)
        self.charts.connect(many, say_many, YES, by)
        self.charts.connect(many, some, NO, by)
        self.charts.connect(some, say_some, YES, by)
        self.charts.connect(some, say_one, NO, by)

    def draw_tool(self, chart: Chart) -> None:
        """Today's conduct when a tool is about to run, three paths: an unread inbox named every few uses and the write held after enough namings; a message read and unanswered held, a journal command and a look at its files going through; the task in hand logged as it goes, with the write held when the log is overdue."""
        by = Actor.system()
        node = lambda kind, key, text="", x=0, y=0: self.charts.add_node(chart, Node(kind=kind, key=key, text=text, x=x, y=y, shipped=True), by)
        line = lambda source, target, port: self.charts.connect(source, target, port, by)
        tool = node(NodeKind.TRIGGER, "tool_starting", x=400, y=0)
        unread = node(NodeKind.CHECK, "unread_messages", x=120, y=92)
        reminders = node(NodeKind.CHECK, "unread_reminders_over", "messages.hold_after_reminders", x=120, y=184)
        writes_unread = node(NodeKind.CHECK, "tool_writes", x=40, y=276)
        hold_unread = node(NodeKind.ACTION, "hold", UNREAD_HELD, x=40, y=368)
        every = node(NodeKind.CHECK, "tool_uses_since_unread_every", "messages.remind_every", x=200, y=368)
        many = node(NodeKind.CHECK, "unread_over", "4", x=200, y=460)
        say_many = node(NodeKind.ACTION, "say", MANY_UNREAD, x=80, y=552)
        some = node(NodeKind.CHECK, "unread_over", "2", x=280, y=552)
        say_some = node(NodeKind.ACTION, "say", SOME_UNREAD, x=200, y=644)
        say_one = node(NodeKind.ACTION, "say", ONE_UNREAD, x=360, y=644)
        owed = node(NodeKind.CHECK, "unanswered_messages", x=400, y=92)
        journal = node(NodeKind.CHECK, "journal_command", x=400, y=184)
        theirs = node(NodeKind.CHECK, "tool_reads_their_files", x=400, y=276)
        held_after = node(NodeKind.CHECK, "tool_uses_since_read_over", "messages.hold_after", x=400, y=368)
        hold_owed = node(NodeKind.ACTION, "hold", ANSWER_HELD, x=320, y=460)
        ask_after = node(NodeKind.CHECK, "tool_uses_since_read_over", "messages.nudge_after", x=480, y=460)
        say_owed = node(NodeKind.ACTION, "say", ANSWER, x=480, y=552)
        writes = node(NodeKind.CHECK, "tool_writes", x=680, y=92)
        in_hand = node(NodeKind.CHECK, "task_in_hand", x=680, y=184)
        overdue = node(NodeKind.CHECK, "edits_since_log_over", "tasks.log_after", x=680, y=276)
        hold_log = node(NodeKind.ACTION, "hold", LOG_OVERDUE, x=600, y=368)
        first = node(NodeKind.CHECK, "edits_since_log_at", "tasks.first_nudge_after", x=760, y=368)
        say_soon = node(NodeKind.ACTION, "say", LOG_SOON, x=680, y=460)
        named = node(NodeKind.CHECK, "edits_since_log_every", "tasks.name_every", x=840, y=460)
        say_in_hand = node(NodeKind.ACTION, "say", IN_HAND, x=840, y=552)
        line(tool, unread, THEN)
        line(unread, reminders, YES)
        line(reminders, writes_unread, YES)
        line(writes_unread, hold_unread, YES)
        line(writes_unread, every, NO)
        line(reminders, every, NO)
        line(every, many, YES)
        line(many, say_many, YES)
        line(many, some, NO)
        line(some, say_some, YES)
        line(some, say_one, NO)
        line(tool, owed, THEN)
        line(owed, journal, YES)
        line(journal, theirs, NO)
        line(theirs, held_after, NO)
        line(held_after, hold_owed, YES)
        line(held_after, ask_after, NO)
        line(ask_after, say_owed, YES)
        line(tool, writes, THEN)
        line(writes, in_hand, YES)
        line(in_hand, overdue, YES)
        line(overdue, hold_log, YES)
        line(overdue, first, NO)
        line(first, say_soon, YES)
        line(first, named, NO)
        line(named, say_in_hand, YES)

    def draw_message(self, chart: Chart) -> None:
        """Today's conduct when a message arrives: one the user left is named to the agent by number, typed into its terminal."""
        by = Actor.system()
        node = lambda kind, key, text="", x=0, y=0: self.charts.add_node(chart, Node(kind=kind, key=key, text=text, x=x, y=y, shipped=True), by)
        arrives = node(NodeKind.TRIGGER, "messages.created", x=400, y=0)
        by_user = node(NodeKind.CHECK, "message_by_user", x=400, y=92)
        named = node(NodeKind.ACTION, "type", NEW_MESSAGE, x=400, y=184)
        self.charts.connect(arrives, by_user, THEN, by)
        self.charts.connect(by_user, named, YES, by)

    def draw_stop(self, chart: Chart) -> None:
        """Today's conduct at a stop: at rest, parked tasks hold the stop in any mode, and in auto mode the next open task holds it."""
        by = Actor.system()
        node = lambda kind, key, text="", x=0, y=0: self.charts.add_node(chart, Node(kind=kind, key=key, text=text, x=x, y=y, shipped=True), by)
        stop = node(NodeKind.TRIGGER, "idle", x=400, y=0)
        at_rest = node(NodeKind.CHECK, "plain_idle", x=400, y=92)
        parked = node(NodeKind.CHECK, "parked_tasks", x=400, y=276)
        say_parked = node(NodeKind.ACTION, "block_stop", PARKED, x=160, y=368)
        auto = node(NodeKind.CHECK, "auto_mode", x=400, y=496)
        open_ = node(NodeKind.CHECK, "open_tasks", x=400, y=588)
        hold_stop = node(NodeKind.ACTION, "block_stop", NEXT, x=400, y=680)
        self.charts.connect(stop, at_rest, THEN, by)
        self.charts.connect(at_rest, parked, YES, by)
        self.charts.connect(parked, say_parked, YES, by)
        self.charts.connect(parked, auto, NO, by)
        self.charts.connect(auto, open_, YES, by)
        self.charts.connect(open_, hold_stop, YES, by)
