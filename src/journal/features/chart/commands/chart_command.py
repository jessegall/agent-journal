from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.features.chart.catalogue import Catalogue
from journal.features.chart.seeds.shipped_chart import EVENT_ORDER, ShippedChart
from journal.features.chart.assumptions import Assumptions
from journal.features.chart.trial import Trial
from journal.features.chart.validation import TEXT_LIMIT, Validation
from journal.refused import Refused
from journal.models.chart import Chart
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
        new.add_argument("--for", dest="state", default="", help="the state this workflow is for; none means it always runs")
        new.add_argument("--on", dest="event", required=True, help="the event it answers, a trigger of the catalogue")
        self.verb(verbs, "drop", "take a workflow out, with its nodes").add_argument("n", type=int)
        node = self.verb(verbs, "node", "add a node naming a catalogue entry")
        node.add_argument("kind", choices=[k.value for k in NodeKind])
        node.add_argument("key")
        node.add_argument("--text", default="", help="the line an action says, holds with, blocks with or types, or the sequence it starts")
        node.add_argument("--in", dest="chart", type=int, default=0, help="the workflow by its number")
        node.add_argument("--for", dest="state", default="", help="the workflow by its state, with --on")
        node.add_argument("--on", dest="event", default="", help="the event of the workflow named by --for")
        line = self.verb(verbs, "line", "draw a line from one node to another")
        line.add_argument("source", type=int)
        line.add_argument("target", type=int)
        line.add_argument("--port", default=THEN, choices=PORTS, help="then from a trigger or an action; yes or no from a check")
        order = self.verb(verbs, "order", "the order an event's workflows run in: every one of them, by number, first to last")
        order.add_argument("event")
        order.add_argument("ids", type=int, nargs="+")
        remove = self.verb(verbs, "remove", "take a node out, with its lines")
        remove.add_argument("n", type=int)
        for editing in (node, line, remove):
            editing.add_argument("--edit-default", dest="edit_default", action="store_true", help="allowed on a default workflow: an edit changes how the journal drives the agent")
        reset = self.verb(verbs, "reset", "a shipped workflow as shipped again: every edit gone")
        reset.add_argument("chart", type=int, nargs="?", default=0, help="the workflow's number")
        reset.add_argument("--for", dest="state", default="", help="the workflow by its state, with --on")
        reset.add_argument("--on", dest="event", default="", help="the event of the workflow named by --for")
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
            bound = f" [{chart.state or 'always'} at {chart.event}, place {chart.place}]"
            print(f"workflow {chart.id}{bound}, revision {chart.revision} by {chart.updated_by.stamp if chart.updated_by else 'nobody'}: {chart.title}")
            for node in self.charts.nodes_of(chart):
                shown = f"{node.key} ({self.entries.entry(node.kind, node.key).title})" if node.kind == NodeKind.TRIGGER else node.key
                print(f"{node.id:>4}  {node.kind:<8} {shown}" + (f": {node.text}" if node.text else "") + ("" if node.shipped else "  (edited)"))
            for line in self.charts.lines_of(chart):
                print(f"      {line.source.id} --{line.kind}--> {line.target.id}")
        return 0

    def in_order(self) -> list[Chart]:
        """By event, in the order the events come, and within one in the order the workflows run."""
        return sorted(self.charts.all(), key=lambda c: (EVENT_ORDER.index(c.event) if c.event in EVENT_ORDER else len(EVENT_ORDER), c.event, c.place, c.id))

    def named_workflow(self, number: int, state: str, event: str) -> Chart:
        """The workflow a command means: by its number, or by the state and the event it is for."""
        if number:
            return self.charts.find(number)
        if state and event:
            found = self.charts.for_pair(state, event)
            if found is None:
                raise Refused(f"no workflow is for {state} at {event}: journal chart new \"<title>\" --for {state} --on {event} makes one")
            return found
        raise Refused("name the workflow: --in <n> by its number, or --for <state> --on <event>")

    def new(self, args: Namespace, where: Where) -> int:
        """A workflow of your own for a state at an event, born with its trigger."""
        chart = Chart(title=args.title, state=args.state, event=args.event, place=self.charts.next_place(args.event))
        faults = self.validation.binding_faults(chart)
        if faults:
            raise Refused(str(faults[0]))
        chart = self.charts.save(chart, where.actor)
        self.charts.add_node(chart, Node(kind=NodeKind.TRIGGER, key=args.event, x=400, y=0), where.actor)
        print(f"workflow {chart.id}: {chart.title}")
        return 0

    def drop(self, args: Namespace, where: Where) -> int:
        chart = self.charts.find(args.n)
        if chart.shipped:
            raise Refused(f"workflow {chart.id} is a shipped one and stays: empty it, or journal chart reset {chart.id} brings its drawing back")
        self.charts.remove(chart, where.actor)
        print(f"workflow {chart.id} taken out: {chart.title}")
        return 0

    @staticmethod
    def editable(chart: Chart, args: Namespace) -> Chart:
        """A default workflow is changed by command only with the flag that says the user knows it changes how the journal drives the agent."""
        if chart.shipped and not args.edit_default:
            raise Refused(f"workflow {chart.id}, {chart.title}, is a default one: add --edit-default to change it, knowing it changes how the journal drives the agent")
        return chart

    def catalogue(self, args: Namespace, where: Where) -> int:
        for entry in self.entries.all():
            print(f"{entry.kind:<8} {entry.key:<28} {entry.title}: {entry.about}")
        return 0

    def node(self, args: Namespace, where: Where) -> int:
        kind = NodeKind(args.kind)
        entry = self.entries.entry(kind, args.key)
        if len(args.text) > TEXT_LIMIT:
            raise Refused(f"a node's text is at most {TEXT_LIMIT} characters, this one is {len(args.text)}")
        chart = self.editable(self.named_workflow(args.chart, args.state, args.event), args)
        wrong = self.validation.action_faults([{"kind": kind, "key": args.key, "text": args.text}])
        if wrong:
            raise Refused(wrong[0])
        if kind == NodeKind.TRIGGER:
            present = [{"kind": n.kind, "key": n.key} for n in self.charts.nodes_of(chart)]
            faults = self.validation.trigger_faults(chart, present + [{"kind": kind, "key": args.key}])
            if faults:
                raise Refused(str(faults[0]))
        node = self.charts.add_node(chart, Node(kind=kind, key=args.key, text=args.text).cleaned(), where.actor)
        self.charts.revised(chart, where.actor)
        print(f"node {node.id}: {entry.title}" + (f", {node.text}" if node.text else ""))
        return 0

    def line(self, args: Namespace, where: Where) -> int:
        source, target = self.charts.nodes.find(args.source), self.charts.nodes.find(args.target)
        fault = self.validation.port_fault({"id": source.id, "kind": source.kind, "key": source.key}, {"id": target.id, "kind": target.kind}, args.port)
        if fault:
            raise Refused(fault[0])
        chart = self.editable(self.charts.chart_of(source), args)
        self.charts.connect(source, target, args.port, where.actor)
        self.charts.revised(chart, where.actor)
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
        """A shipped workflow back to its drawing; one taken out on purpose, named by its state and event, drawn again."""
        if not args.chart and args.state and args.event and self.shipped.key_of(args.state, args.event) in self.shipped.retired():
            chart = self.shipped.restore(self.shipped.key_of(args.state, args.event), where.actor)
            print(f"chart {chart.id} drawn again from the shipped drawing: {chart.title}")
            return 0
        chart = self.named_workflow(args.chart, args.state, args.event)
        if not chart.shipped:
            raise Refused(f"workflow {chart.id} is not a shipped one: only a shipped workflow has a drawing to go back to")
        chart = self.shipped.reset(chart, where.actor)
        print(f"chart {chart.id} reset to the shipped one, revision {chart.revision}")
        return 0

    def order(self, args: Namespace, where: Where) -> int:
        """The event's workflows reordered as given, at the revisions they stand at."""
        standing = {c.id: c for c in self.charts.for_event(args.event)}
        faults = self.validation.order_faults(args.event, [{"id": n, "revision": standing[n].revision if n in standing else -1} for n in args.ids])
        if faults:
            raise Refused(str(faults[0]))
        placed = self.charts.reorder(args.event, args.ids, where.actor)
        print(f"{args.event}: " + ", ".join(f"{c.place + 1}. {c.title}" for c in placed))
        return 0

    def remove(self, args: Namespace, where: Where) -> int:
        node = self.charts.nodes.find(args.n)
        chart = self.editable(self.charts.chart_of(node), args)
        self.charts.remove_node(node, where.actor)
        self.charts.revised(chart, where.actor)
        print(f"node {node.id} removed")
        return 0
