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
