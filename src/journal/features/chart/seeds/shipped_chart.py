from journal.features.seed import Seed
from journal.models.actor import Actor
from journal.models.chart import Chart
from journal.models.node import Node
from journal.models.node_kind import NodeKind
from journal.repositories.charts import NO, THEN, YES, Charts

TITLE = "Agent stops"
PARKED = "parked tasks, still open: {{parked_tasks}}. journal task resume <n> picks one up; leave them parked only on purpose"
NEXT = "tasks are open, and auto mode is on: task {{next_task}} next: {{next_task_title}}. sure you want to stop? carry on with it, or journal stuck \"<why>\" if you are truly stuck"


class ShippedChart(Seed):
    """The one chart of the journal, made once, and given today's conduct at a stop while it has no nodes at all: at rest and not the same stop again, parked tasks are named in any mode, and in auto mode the next open task holds the stop. A chart with any node is the user's and is left alone."""

    def __init__(self, charts: Charts) -> None:
        self.charts = charts

    def run(self) -> None:
        charts = self.charts.all()
        chart = charts[0] if charts else self.charts.save(Chart(title=TITLE), Actor.system())
        if self.charts.nodes_of(chart):
            return
        self.draw(chart)

    def reset(self, by: Actor) -> Chart:
        """The chart as shipped again: every node and line gone, the shipped ones drawn anew, one more revision."""
        chart = self.charts.the()
        for node in self.charts.nodes_of(chart):
            self.charts.remove_node(node, by)
        self.draw(chart)
        return self.charts.save(chart.saved_again().with_(title=TITLE), by)

    def draw(self, chart: Chart) -> None:
        by = Actor.system()
        node = lambda kind, key, text="", x=0, y=0: self.charts.add_node(chart, Node(kind=kind, key=key, text=text, x=x, y=y, shipped=True), by)
        stop = node(NodeKind.TRIGGER, "idle", x=400, y=0)
        at_rest = node(NodeKind.CHECK, "plain_idle", x=400, y=92)
        again = node(NodeKind.CHECK, "same_stop_again", x=400, y=184)
        parked = node(NodeKind.CHECK, "parked_tasks", x=400, y=276)
        say_parked = node(NodeKind.ACTION, "say", PARKED, x=160, y=368)
        auto = node(NodeKind.CHECK, "auto_mode", x=400, y=496)
        open_ = node(NodeKind.CHECK, "open_tasks", x=400, y=588)
        hold_stop = node(NodeKind.ACTION, "block_stop", NEXT, x=400, y=680)
        self.charts.connect(stop, at_rest, THEN, by)
        self.charts.connect(at_rest, again, YES, by)
        self.charts.connect(again, parked, NO, by)
        self.charts.connect(parked, say_parked, YES, by)
        self.charts.connect(parked, auto, NO, by)
        self.charts.connect(auto, open_, YES, by)
        self.charts.connect(open_, hold_stop, YES, by)
