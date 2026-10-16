from journal.db.connection import Connection
from journal.features.bus import Bus
from journal.models.actor import Actor
from journal.models.chart import Chart
from journal.models.link import Link
from journal.models.node import Node
from journal.models.node_kind import NodeKind
from journal.models.ref import Ref
from journal.repositories.links import Links
from journal.repositories.nodes import Nodes
from journal.repositories.repository import Repository

NODE_OF = "node_of"
THEN, YES, NO = "then", "yes", "no"
PORTS = (THEN, YES, NO)
"""A line leaves a trigger or an action by then, and a check by yes or no."""


class Charts(Repository[Chart]):
    model = Chart

    def __init__(self, connection: Connection, bus: Bus, links: Links, nodes: Nodes) -> None:
        super().__init__(connection, bus)
        self.links, self.nodes = links, nodes

    def shipped(self) -> list[Chart]:
        """The workflows the journal ships, one per event, in the order they were made."""
        return [c for c in self.all() if c.shipped]

    def shipped_on(self, event: str) -> list[Chart]:
        return [c for c in self.shipped() if c.event == event]

    def answering(self, event: str) -> Chart | None:
        """The one workflow that answers an event: the oldest whose trigger is on it. A journal holds one per event; should it somehow hold two, the oldest runs and the rest are sidelined."""
        for chart in self.all():
            if any(n.kind == NodeKind.TRIGGER and n.key == event for n in self.nodes_of(chart)):
                return chart
        return None

    def sidelined_by(self, chart: Chart) -> Chart | None:
        """The older workflow that answers this one's event instead, when there is one."""
        trigger = next((n for n in self.nodes_of(chart) if n.kind == NodeKind.TRIGGER), None)
        answering = self.answering(trigger.key) if trigger else None
        return answering if answering and answering.id != chart.id else None

    def remove(self, chart: Chart, by: Actor) -> None:
        for node in self.nodes_of(chart):
            self.remove_node(node, by)
        self.delete(chart, by)

    def nodes_of(self, chart: Chart) -> list[Node]:
        return [self.nodes.find(ref.id) for ref in self.links.sources(chart, NODE_OF)]

    def lines_of(self, chart: Chart) -> list[Link]:
        return [link for node in self.nodes_of(chart) for link in self.links.of(node) if link.kind in PORTS and link.source == Ref.to(node)]

    def add_node(self, chart: Chart, node: Node, by: Actor) -> Node:
        added = self.nodes.save(node, by)
        self.links.save(Link(source=Ref.to(added), target=Ref.to(chart), kind=NODE_OF), by)
        return added

    def remove_node(self, node: Node, by: Actor) -> None:
        self.links.remove_all_of(node)
        self.nodes.delete(node, by)

    def connect(self, source: Node, target: Node, port: str, by: Actor) -> Link:
        return self.links.save(Link(source=Ref.to(source), target=Ref.to(target), kind=port), by)

    def replace(self, chart: Chart, nodes: list[dict], lines: list[dict], by: Actor) -> Chart:
        """The chart saved whole: nodes given with an id it has are kept and updated, others made, those left out removed; every line drawn anew. One more revision."""
        present = {node.id: node for node in self.nodes_of(chart)}
        kept = {}
        for given in nodes:
            own = present.pop(int(given["id"]) if str(given.get("id", "")).isdigit() else 0, None)
            fields = {"kind": given["kind"], "key": given["key"], "text": given.get("text", ""), "x": int(given.get("x", 0)), "y": int(given.get("y", 0))}
            touched = own is not None and (own.kind != fields["kind"] or own.key != fields["key"] or own.text != fields["text"])
            kept[str(given.get("id", ""))] = self.nodes.save(own.with_(**fields, shipped=own.shipped and not touched).cleaned(), by) if own else self.add_node(chart, Node(**fields).cleaned(), by)
        for gone in present.values():
            self.remove_node(gone, by)
        for line in self.lines_of(chart):
            self.links.delete(line, by)
        for line in lines:
            self.connect(kept[str(line["from"])], kept[str(line["to"])], line.get("port", THEN), by)
        return self.save(chart.saved_again(), by)
