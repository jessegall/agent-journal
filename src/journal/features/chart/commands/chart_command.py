from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.features.chart.catalogue import Catalogue
from journal.features.chart.seeds.shipped_chart import ShippedChart
from journal.features.chart.assumptions import Assumptions
from journal.features.chart.trial import Trial
from journal.features.chart.validation import TEXT_LIMIT, Validation
from journal.refused import Refused
from journal.models.chart import BASE, Chart
from journal.models.node import Node
from journal.models.node_kind import NodeKind
from journal.repositories.charts import PORTS, THEN, Charts
from journal.repositories.scope import Scope


class ChartCommand(Command):
    noun = "chart"

    def __init__(self, charts: Charts, catalogue: Catalogue, validation: Validation, shipped: ShippedChart, trial: Trial, scope: Scope) -> None:
        self.charts, self.entries, self.validation, self.shipped, self.trial, self.scope = charts, catalogue, validation, shipped, trial, scope

    def arguments(self, verbs) -> None:
        self.verb(verbs, "show", "every workflow: its nodes and lines")
        self.verb(verbs, "catalogue", "everything a node may be")
        new = self.verb(verbs, "new", "a new, empty workflow, for a state or the base")
        new.add_argument("title")
        new.add_argument("--state", default="", help="the state this workflow is for, or base for what every state shares; left out, a workflow of the older shape bound to one event")
        self.verb(verbs, "drop", "take a workflow out, with its nodes").add_argument("n", type=int)
        node = self.verb(verbs, "node", "add a node naming a catalogue entry")
        node.add_argument("kind", choices=[k.value for k in NodeKind])
        node.add_argument("key")
        node.add_argument("--text", default="", help="the line an action says, holds with, blocks with or types, or the sequence it starts")
        node.add_argument("--in", dest="chart", type=int, default=0, help="the workflow by its number")
        node.add_argument("--for", dest="state", default="", help="the workflow by its state, or base")
        line = self.verb(verbs, "line", "draw a line from one node to another")
        line.add_argument("source", type=int)
        line.add_argument("target", type=int)
        line.add_argument("--port", default=THEN, choices=PORTS, help="then from a trigger or an action; yes or no from a check")
        self.verb(verbs, "remove", "take a node out, with its lines").add_argument("n", type=int)
        reset = self.verb(verbs, "reset", "a shipped workflow as shipped again: every edit gone")
        reset.add_argument("chart", type=int, nargs="?", default=0, help="the workflow's number")
        reset.add_argument("--for", dest="state", default="", help="the workflow by its state, or base")
        try_ = self.verb(verbs, "try", "a dry run for an agent event here, or a row event with its row: the path and what it would do, nothing done")
        try_.add_argument("trigger")
        try_.add_argument("--row", type=int, default=0, help="the row a row event is about, such as the message's number for messages.created")
        try_.add_argument("--quiet", type=float, default=None, help="how long the agent has been quiet, in seconds, for ticked")
        try_.add_argument("--edits", type=int, default=None, help="the edits since the task in hand was logged, instead of the live count")
        try_.add_argument("--unread", type=int, default=None, help="how many messages are unread, instead of the live inbox")
        try_.add_argument("--state", default=None, help="the state to walk as, instead of the live agent's: working, awaiting, idle and the rest")
        try_.add_argument("--provider", default=None, help="the provider whose agent is tried, claude or codex, whose tool names the tool event takes")

    def show(self, args: Namespace, where: Where) -> int:
        for chart in self.in_order():
            sidelined = self.charts.sidelined_by(chart)
            bound = f" [{chart.state}]" if chart.bound_to_a_state else ""
            print(f"workflow {chart.id}{bound}, revision {chart.revision}: {chart.title}" + (f"  (sidelined: workflow {sidelined.id} answers its event)" if sidelined else ""))
            for node in self.charts.nodes_of(chart):
                shown = f"{node.key} ({self.entries.entry(node.kind, node.key).title})" if node.kind == NodeKind.TRIGGER else node.key
                print(f"{node.id:>4}  {node.kind:<8} {shown}" + (f": {node.text}" if node.text else "") + ("" if node.shipped else "  (edited)"))
            for line in self.charts.lines_of(chart):
                print(f"      {line.source.id} --{line.kind}--> {line.target.id}")
        return 0

    def in_order(self) -> list[Chart]:
        """The base first, then the states' workflows by name, then those of the older shape."""
        bound = sorted((c for c in self.charts.all() if c.bound_to_a_state), key=lambda c: (c.state != BASE, c.state))
        return bound + self.charts.by_event()

    def named_workflow(self, number: int, state: str) -> Chart:
        """The workflow a command means: by its number, or by the state it is for."""
        if number:
            return self.charts.find(number)
        if state:
            found = self.charts.for_state(state)
            if found is None:
                raise Refused(f"no workflow is for {state}: journal chart new \"<title>\" --for {state} makes one")
            return found
        raise Refused("name the workflow: --in <n> by its number, or --for <state>")

    def new(self, args: Namespace, where: Where) -> int:
        faults = self.validation.binding_faults(Chart(title=args.title, state=args.state))
        if faults:
            raise Refused(faults[0])
        chart = self.charts.save(Chart(title=args.title, state=args.state), where.actor)
        print(f"workflow {chart.id}: {chart.title}")
        return 0

    def drop(self, args: Namespace, where: Where) -> int:
        chart = self.charts.find(args.n)
        if chart.shipped:
            raise Refused(f"workflow {chart.id} is a shipped one and stays: empty it, or journal chart reset {chart.id} brings its drawing back")
        self.charts.remove(chart, where.actor)
        print(f"workflow {chart.id} taken out: {chart.title}")
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
        chart = self.named_workflow(args.chart, args.state)
        wrong = self.validation.action_faults([{"kind": kind, "key": args.key, "text": args.text}])
        if wrong:
            raise Refused(wrong[0])
        if kind == NodeKind.TRIGGER:
            present = [{"kind": n.kind, "key": n.key} for n in self.charts.nodes_of(chart)]
            faults = self.validation.trigger_faults(chart, present + [{"kind": kind, "key": args.key}]) + self.validation.taken_faults(chart, [{"kind": kind, "key": args.key}])
            if faults:
                raise Refused(faults[0])
        node = self.charts.add_node(chart, Node(kind=kind, key=args.key, text=args.text).cleaned(), where.actor)
        self.charts.revised(chart, where.actor)
        print(f"node {node.id}: {entry.title}" + (f", {node.text}" if node.text else ""))
        return 0

    def line(self, args: Namespace, where: Where) -> int:
        source, target = self.charts.nodes.find(args.source), self.charts.nodes.find(args.target)
        fault = self.validation.port_fault({"id": source.id, "kind": source.kind}, {"id": target.id, "kind": target.kind}, args.port)
        if fault:
            raise Refused(fault[0])
        self.charts.connect(source, target, args.port, where.actor)
        self.charts.revised(self.charts.chart_of(source), where.actor)
        print(f"line {source.id} --{args.port}--> {target.id}")
        return 0

    def try_(self, args: Namespace, where: Where) -> int:
        ran = self.trial.run(args.trigger, self.scope.id, args.row, Assumptions(quiet=args.quiet, edits=args.edits, unread=args.unread, state=args.state, provider=args.provider))
        title = self.entries.entry(NodeKind.TRIGGER, args.trigger).title
        print(f"{title}{f' of row {args.row}' if args.row else ''}, walked as the state {ran['state'] or 'of no agent'}: nodes {', '.join(str(n) for n in ran['nodes']) or 'none'}")
        if ran["assumed"]:
            print(f"  assumed: {', '.join(ran['assumed'])}")
        for line in ran["would"]:
            print(f"  {line}")
        return 0

    def reset(self, args: Namespace, where: Where) -> int:
        chart = self.named_workflow(args.chart, args.state)
        if not chart.shipped:
            raise Refused(f"workflow {chart.id} is not a shipped one: only a shipped workflow has a drawing to go back to")
        chart = self.shipped.reset(chart, where.actor)
        print(f"chart {chart.id} reset to the shipped one, revision {chart.revision}")
        return 0

    def remove(self, args: Namespace, where: Where) -> int:
        node = self.charts.nodes.find(args.n)
        chart = self.charts.chart_of(node)
        self.charts.remove_node(node, where.actor)
        self.charts.revised(chart, where.actor)
        print(f"node {node.id} removed")
        return 0
