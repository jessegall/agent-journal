from journal.features.seed import Seed
from journal.models.actor import Actor
from journal.models.chart import Chart
from journal.models.node import Node
from journal.models.node_kind import NodeKind
from journal.repositories.charts import NO, THEN, YES, Charts

TITLE = "Agent stops"
OLD_TITLE = "The journal's conduct"
"""The shipped workflow's name before it was named after its event; a journal still carrying it is renamed at boot."""
PARKED = "parked tasks, still open: {{parked_tasks}}. journal task resume <n> picks one up; leave them parked only on purpose"
NEXT = "tasks are open, and auto mode is on: task {{next_task}} next: {{next_task_title}}. sure you want to stop? carry on with it, or journal stuck \"<why>\" if you are truly stuck"


class ShippedChart(Seed):
    """The workflows the journal ships, one per event: each is made at boot where it is absent and left alone where it stands, edited or not, so a journal that upgrades gets the new ones and keeps its own. A reset redraws one by its event."""

    def __init__(self, charts: Charts) -> None:
        self.charts = charts
        self.drawings = {"idle": (TITLE, self.draw_stop)}
        """The events the journal ships a workflow for: each with its title and the drawing that gives it its nodes and lines."""

    def run(self) -> None:
        by = Actor.system()
        self.claim_legacy(by)
        for event, (title, draw) in self.drawings.items():
            if self.charts.shipped_on(event):
                continue
            draw(self.charts.save(Chart(title=title, shipped=True, event=event), by))

    def claim_legacy(self, by: Actor) -> None:
        """A journal from before workflows were marked: its first chart carried the shipped stop rules and is the shipped one on that event."""
        for chart in self.charts.all():
            if chart.shipped:
                continue
            shipped_nodes = [n for n in self.charts.nodes_of(chart) if n.shipped]
            if not shipped_nodes:
                continue
            trigger = next((n.key for n in shipped_nodes if n.kind == NodeKind.TRIGGER), "idle")
            title = self.drawings[trigger][0] if chart.title == OLD_TITLE and trigger in self.drawings else chart.title
            self.charts.save(chart.with_(shipped=True, event=trigger, title=title), by)

    def reset(self, chart: Chart, by: Actor) -> Chart:
        """A shipped workflow as shipped again: every node and line gone, its event's drawing drawn anew, one more revision."""
        title, draw = self.drawings[chart.event]
        for node in self.charts.nodes_of(chart):
            self.charts.remove_node(node, by)
        draw(chart)
        return self.charts.save(chart.saved_again().with_(title=title), by)

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
