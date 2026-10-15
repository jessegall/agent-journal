from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.features.chart.catalogue import Catalogue
from journal.features.chart.seeds.shipped_chart import ShippedChart
from journal.features.chart.validation import TEXT_LIMIT, Validation
from journal.refused import Refused
from journal.models.node import Node
from journal.models.node_kind import NodeKind
from journal.repositories.charts import PORTS, THEN, Charts


class ChartCommand(Command):
    noun = "chart"

    def __init__(self, charts: Charts, catalogue: Catalogue, validation: Validation, shipped: ShippedChart) -> None:
        self.charts, self.entries, self.validation, self.shipped = charts, catalogue, validation, shipped

    def arguments(self, verbs) -> None:
        self.verb(verbs, "show", "the chart: its nodes and lines")
        self.verb(verbs, "catalogue", "everything a node may be")
        node = self.verb(verbs, "node", "add a node naming a catalogue entry")
        node.add_argument("kind", choices=[k.value for k in NodeKind])
        node.add_argument("key")
        node.add_argument("--text", default="", help="the line an action says, holds with, blocks with or types, or the sequence it starts")
        line = self.verb(verbs, "line", "draw a line from one node to another")
        line.add_argument("source", type=int)
        line.add_argument("target", type=int)
        line.add_argument("--port", default=THEN, choices=PORTS, help="then from a trigger or an action; yes or no from a check")
        self.verb(verbs, "remove", "take a node out, with its lines").add_argument("n", type=int)
        self.verb(verbs, "reset", "the chart as shipped again: every edit gone")

    def show(self, args: Namespace, where: Where) -> int:
        chart = self.charts.the()
        print(f"chart {chart.id}, revision {chart.revision}: {chart.title}")
        for node in self.charts.nodes_of(chart):
            print(f"{node.id:>4}  {node.kind:<8} {node.key}" + (f": {node.text}" if node.text else "") + ("" if node.shipped else "  (edited)"))
        for line in self.charts.lines_of(chart):
            print(f"      {line.source.id} --{line.kind}--> {line.target.id}")
        return 0

    def catalogue(self, args: Namespace, where: Where) -> int:
        for entry in self.entries.all():
            print(f"{entry.kind:<8} {entry.key:<28} {entry.title}: {entry.about}")
        return 0

    def node(self, args: Namespace, where: Where) -> int:
        kind = NodeKind(args.kind)
        entry = self.entries.entry(kind, args.key)
        if len(args.text) > TEXT_LIMIT:
            raise Refused(f"a node's text is at most {TEXT_LIMIT} characters, this one is {len(args.text)}")
        node = self.charts.add_node(self.charts.the(), Node(kind=kind, key=args.key, text=args.text).cleaned(), where.actor)
        print(f"node {node.id}: {entry.title}" + (f", {node.text}" if node.text else ""))
        return 0

    def line(self, args: Namespace, where: Where) -> int:
        source, target = self.charts.nodes.find(args.source), self.charts.nodes.find(args.target)
        fault = self.validation.port_fault({"id": source.id, "kind": source.kind}, {"id": target.id, "kind": target.kind}, args.port)
        if fault:
            raise Refused(fault[0])
        self.charts.connect(source, target, args.port, where.actor)
        print(f"line {source.id} --{args.port}--> {target.id}")
        return 0

    def reset(self, args: Namespace, where: Where) -> int:
        chart = self.shipped.reset(where.actor)
        print(f"chart {chart.id} reset to the shipped one, revision {chart.revision}")
        return 0

    def remove(self, args: Namespace, where: Where) -> int:
        node = self.charts.nodes.find(args.n)
        self.charts.remove_node(node, where.actor)
        print(f"node {node.id} removed")
        return 0
