from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.support.actor import Actor
from journal.models.chart import Chart
from journal.support.drawn_line import PORTS, THEN, DrawnLine
from journal.support.drawn_node import DrawnNode
from journal.support.graph import Graph
from journal.models.link import Link
from journal.models.node import Node
from journal.models.node_kind import NodeKind
from journal.support.ref import Ref
from journal.repositories.links import Links
from journal.repositories.nodes import Nodes
from journal.repositories.repository import Repository

NODE_OF = "node_of"


class Charts(Repository[Chart]):
    model = Chart

    def __init__(self, connection: Connection, bus: Bus, links: Links, nodes: Nodes) -> None:
        super().__init__(connection, bus)
        self.links, self.nodes = links, nodes
        self._graphs: dict[int, Graph] = {}

    def graph(self, chart: Chart) -> Graph:
        """The workflow compiled for walking, built from its rows the first time and kept until a write through this repository changes any workflow."""
        if chart.id not in self._graphs:
            self._graphs[chart.id] = Graph.of(self.nodes_of(chart), self.lines_of(chart))
        return self._graphs[chart.id]

    def save(self, row: Chart, by: Actor) -> Chart:
        self._graphs.clear()
        return super().save(row, by)

    def shipped(self) -> list[Chart]:
        """The workflows the journal ships, in the order they were made."""
        return [c for c in self.all() if c.shipped]

    def for_pair(self, state: str, event: str) -> Chart | None:
        """The first workflow in order for a state at an event, when the journal holds one."""
        return next((c for c in self.for_event(event) if c.state == state), None)

    def for_event(self, event: str) -> list[Chart]:
        """Every workflow that holds a trigger for the event, in the order they run at it."""
        return sorted((c for c in self.all() if c.answers(event)), key=lambda c: (c.place_at(event), c.id))

    def reorder(self, event: str, ids: list[int], by: Actor) -> list[Chart]:
        """The event's workflows in the order given, each that moved saved with its new place and one more revision, as the actor."""
        standing = {c.id: c for c in self.for_event(event)}
        placed = []
        for place, number in enumerate(ids):
            chart = standing[number]
            placed.append(self.save(chart.placed(event, place).saved_again(), by) if chart.place_at(event) != place else chart)
        self._graphs.clear()
        return placed

    def next_place(self, event: str) -> int:
        """The place after the last workflow of the event, zero for the first: a new one comes after everything."""
        return max([c.place_at(event) for c in self.for_event(event)] + [-1]) + 1

    def remove(self, chart: Chart, by: Actor) -> None:
        for node in self.nodes_of(chart):
            self.remove_node(node, by)
        self.delete(chart, by)
        self._graphs.clear()

    def nodes_of(self, chart: Chart) -> list[Node]:
        return [self.nodes.find(ref.id) for ref in self.links.sources(chart, NODE_OF)]

    def lines_of(self, chart: Chart) -> list[Link]:
        return [link for node in self.nodes_of(chart) for link in self.links.of(node) if link.kind in PORTS and link.source == Ref.to(node)]

    def chart_of(self, node: Node) -> Chart:
        return self.find(self.links.targets(node, NODE_OF)[0].id)

    def add_node(self, chart: Chart, node: Node, by: Actor) -> Node:
        """A node made and linked to its workflow; the compiled graphs go after the link is in, since a walk set off by the node's own row would compile the workflow without it."""
        added = self.nodes.save(node, by)
        self.links.save(Link(source=Ref.to(added), target=Ref.to(chart), kind=NODE_OF), by)
        self._graphs.clear()
        if added.kind == NodeKind.TRIGGER:
            self.placed_by_triggers(chart, by)
        return added

    def remove_node(self, node: Node, by: Actor) -> None:
        chart = self.chart_of(node) if node.kind == NodeKind.TRIGGER else None
        self.links.remove_all_of(node)
        self.nodes.delete(node, by)
        self._graphs.clear()
        if chart is not None:
            self.placed_by_triggers(chart, by)

    def placed_by_triggers(self, chart: Chart, by: Actor) -> Chart:
        """The workflow placed at each event it holds a trigger for, and always at the event it was made for, so one turned off keeps its place in that list: a new trigger's event at the end of its list, another event whose trigger is gone no longer placed."""
        standing = self.find(chart.id)
        events = {n.key for n in self.nodes_of(standing) if n.kind == NodeKind.TRIGGER} | ({standing.event} if standing.event else set())
        settled = standing
        for event in sorted(events - set(standing.places)):
            settled = settled.placed(event, self.next_place(event))
        for event in set(standing.places) - events:
            settled = settled.unplaced(event)
        return self.save(settled, by) if settled.places != standing.places else standing

    def connect(self, source: Node, target: Node, port: str, by: Actor) -> Link:
        """One line per port: a new line from a port that has one takes its place."""
        for standing in [l for l in self.lines_of(self.chart_of(source)) if l.source == Ref.to(source) and l.kind == port]:
            self.links.delete(standing, by)
        line = self.links.save(Link(source=Ref.to(source), target=Ref.to(target), kind=port), by)
        self._graphs.clear()
        return line

    def revised(self, chart: Chart, by: Actor) -> Chart:
        """One more revision at the end of a write to a workflow, by page or by command, so a page save from an older read is refused."""
        self._graphs.clear()
        return self.save(self.find(chart.id).saved_again(), by)

    def replace(self, chart: Chart, nodes: list[DrawnNode], lines: list[DrawnLine], by: Actor) -> Chart:
        """The chart saved whole: nodes given with an id it has are kept and updated, others made, those left out removed; every line drawn anew."""
        present = {node.id: node for node in self.nodes_of(chart)}
        kept = {}
        for given in nodes:
            own = present.pop(given.number, None)
            drawn = Node(kind=NodeKind(given.kind), key=given.key, text=given.text, x=given.x, y=given.y)
            touched = own is not None and (own.kind != drawn.kind or own.key != drawn.key or own.text != drawn.text)
            kept[given.id] = self.nodes.save(own.with_(kind=drawn.kind, key=drawn.key, text=drawn.text, x=drawn.x, y=drawn.y, shipped=own.shipped and not touched).cleaned(), by) if own else self.add_node(chart, drawn.cleaned(), by)
        for gone in present.values():
            self.remove_node(gone, by)
        for line in self.lines_of(chart):
            self.links.delete(line, by)
        for line in lines:
            self.connect(kept[line.source], kept[line.target], line.port, by)
        return self.revised(chart, by)
