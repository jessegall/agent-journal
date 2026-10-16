from dataclasses import asdict

from journal.features.chart.catalogue import Catalogue
from journal.features.chart.seeds.shipped_chart import ShippedChart
from journal.features.chart.assumptions import Assumptions
from journal.features.chart.fillers import Fillers
from journal.features.chart.traces import Traces
from journal.features.chart.trial import Trial
from journal.features.chart.validation import LOCK_WHY, Validation
from journal.engine.states_catalogue import StatesCatalogue
from journal.http.request import Request
from journal.http.response import Response
from journal.models.chart import Chart
from journal.models.node_kind import NodeKind
from journal.models.node import Node
from journal.repositories.charts import Charts
from journal.repositories.not_found import NotFound
from journal.repositories.environments import Environments


class ChartController:
    """The workflow page: every workflow by title, one read whole with its nodes and lines, saved whole as the user, made, taken out, the shipped one reset, and any event tried dry."""

    def __init__(self, charts: Charts, catalogue: Catalogue, validation: Validation, shipped: ShippedChart, trial: Trial, environments: Environments, traces: Traces, states: StatesCatalogue) -> None:
        self.charts, self.catalogue, self.validation, self.shipped, self.trial, self.environments = charts, catalogue, validation, shipped, trial, environments
        self.traces, self.states = traces, states

    def index(self, request: Request) -> Response:
        return Response.json({"workflows": [self.named(c) for c in self.charts.all()], "catalogue": self.entries(), "states": self.listed_states(), "fillers": Fillers.listed()})

    def listed_states(self) -> list[dict]:
        return self.states.listed()

    def runs(self, request: Request) -> Response:
        """The newest walks across every workflow, each naming the workflows it ran, so a line the agent heard leads to the workflow that said it."""
        titles = {c.id: c.title for c in self.charts.all()}
        runs = [{**run, "titles": [titles.get(n, f"workflow {n}") for n in run["workflows"]]} for run in self.traces.recent(int(request.query.get("last", 10) or 10))]
        return Response.json({"runs": runs})

    def order(self, request: Request) -> Response:
        """The order of an event's workflows, as dragged: every workflow of the event named once with the revision it was read at, else refused, naming who saved first when one moved since."""
        event = request.body.get("trigger", "")
        given = [{"id": int(row.get("id", 0)), "revision": int(row.get("revision", -1))} for row in request.body.get("order", [])]
        faults = self.validation.order_faults(event, given)
        if faults:
            return Response.json({"error": "; ".join(map(str, faults)), "faults": [asdict(f) for f in faults]}, 409)
        placed = self.charts.reorder(event, [row["id"] for row in given], request.actor)
        return Response.json({"trigger": event, "workflows": [self.named(c) for c in placed]})

    def off(self, request: Request) -> Response:
        """A workflow turned off: its trigger taken out, the rest kept, so it answers nothing until turned on again; one that is or holds the journal's law stays on."""
        chart = self.charts.find(request.number("id"))
        refusal = self.validation.off_fault(chart)
        if refusal:
            return Response.refused(str(refusal[0]))
        for node in [n for n in self.charts.nodes_of(chart) if n.kind == NodeKind.TRIGGER]:
            self.charts.remove_node(node, request.actor)
        return Response.json(self.drawn(self.charts.revised(chart, request.actor)))

    def on(self, request: Request) -> Response:
        """A workflow turned on again: its trigger put back, the one of the event it is for."""
        chart = self.charts.find(request.number("id"))
        if not any(n.kind == NodeKind.TRIGGER for n in self.charts.nodes_of(chart)):
            self.charts.add_node(chart, Node(kind=NodeKind.TRIGGER, key=chart.event, x=400, y=0, shipped=chart.shipped), request.actor)
        return Response.json(self.drawn(self.charts.revised(chart, request.actor)))

    def one(self, request: Request) -> Response:
        try:
            return Response.json(self.drawn(self.charts.find(request.number("id"))))
        except NotFound as missing:
            return Response.not_found(str(missing))

    def create(self, request: Request) -> Response:
        """A workflow of the user's own for a state at an event, or for every state when no state is named, born with its trigger, after the others of its event, with a title that names it unless given."""
        state, event = request.body.get("state", "").strip(), request.body.get("trigger", "").strip()
        whose = self.states.title_of(state) if state else "Always"
        title = request.body.get("title", "").strip() or f"{whose} at {self.catalogue.entry(NodeKind.TRIGGER, event).title}" if self.catalogue.has(NodeKind.TRIGGER, event) else request.body.get("title", "").strip()
        chart = Chart(title=title, state=state, event=event, place=self.charts.next_place(event))
        faults = self.validation.binding_faults(chart)
        if faults:
            return Response.refused(faults[0])
        chart = self.charts.save(chart, request.actor)
        self.charts.add_node(chart, Node(kind=NodeKind.TRIGGER, key=event, x=400, y=0), request.actor)
        return Response.json(self.drawn(chart), 201)

    def remove(self, request: Request) -> Response:
        chart = self.charts.find(request.number("id"))
        if chart.locked:
            return Response.refused(f"workflow {chart.id} is locked, {LOCK_WHY}: it stays")
        if chart.shipped:
            return Response.refused("a shipped workflow stays; empty it or reset it instead")
        self.charts.remove(chart, request.actor)
        return Response.json({"removed": chart.id})

    def save(self, request: Request) -> Response:
        chart = self.charts.find(request.number("id"))
        if int(request.body.get("revision", -1)) != chart.revision:
            return Response.json({"error": f"the workflow changed since you opened it: it is at revision {chart.revision}, read it again", "revision": chart.revision, "conflict": True,
                                  "revised_by": chart.updated_by.stamp if chart.updated_by else "", "revised_at": chart.updated_at.timestamp() if chart.updated_at else 0}, 409)
        faults = self.validation.faults(chart, request.body.get("nodes", []), request.body.get("lines", []))
        if faults:
            return Response.json({"error": "the workflow is not saved: " + "; ".join(map(str, faults)), "faults": [asdict(f) for f in faults]}, 409)
        return Response.json(self.drawn(self.charts.replace(chart, request.body.get("nodes", []), request.body.get("lines", []), request.actor)))

    def try_(self, request: Request) -> Response:
        """A dry run: the path the chart would take for an agent event in an environment, and what it would do, nothing done."""
        environment = self.environments.named(request.body.get("environment", "main")).id
        body = request.body
        assumed = Assumptions(quiet=body.get("quiet"), edits=body.get("edits"), unread=body.get("unread"), state=body.get("state"), provider=body.get("provider"))
        return Response.json(self.trial.run(body.get("trigger", "idle"), environment, int(body.get("row", 0) or 0), assumed))

    def reset(self, request: Request) -> Response:
        chart = self.charts.find(request.number("id"))
        if not chart.shipped:
            return Response.refused("only a shipped workflow has a shipped drawing to go back to")
        return Response.json(self.drawn(self.shipped.reset(chart, request.actor)))

    def named(self, chart: Chart) -> dict:
        last_walk, last_failure = self.traces.last_walk(chart), self.traces.last_failure(chart)
        return {"id": chart.id, "title": chart.title, "revision": chart.revision, "shipped": chart.shipped, "event": chart.event, "state": chart.state, "place": chart.place, "off": not self.charts.graph(chart).triggers,
                "edited": not all(n.shipped for n in self.charts.nodes_of(chart)), "failed": bool(last_failure) and last_failure["at"] >= last_walk.get("at", 0),
                "behind": self.shipped.behind(chart), "locked": chart.locked, "guarded": any(n.locked for n in self.charts.nodes_of(chart)),
                "warnings": self.validation.warnings(chart), "revised_by": chart.updated_by.stamp if chart.updated_by else "", "last_walk": last_walk, "last_failure": last_failure}

    def entries(self) -> list[dict]:
        return [{**asdict(e), "kind": e.kind.value, "tried": self.trial.stands_in_for(e.key)} for e in self.catalogue.all()]

    def drawn(self, chart: Chart) -> dict:
        return {
            "state": chart.state,
            **self.named(chart), "shipped": chart.shipped,
            "nodes": [{"id": n.id, "kind": n.kind.value, "key": n.key, "text": n.text, "x": n.x, "y": n.y, "shipped": n.shipped, "locked": n.locked} for n in self.charts.nodes_of(chart)],
            "lines": [{"from": line.source.id, "to": line.target.id, "port": line.kind} for line in self.charts.lines_of(chart)],
            "catalogue": self.entries(),
        }
