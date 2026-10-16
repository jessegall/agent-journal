from dataclasses import asdict

from journal.features.chart.catalogue import Catalogue
from journal.features.chart.seeds.shipped_chart import ShippedChart
from journal.features.chart.assumptions import Assumptions
from journal.features.chart.trial import Trial
from journal.features.chart.validation import Validation
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

    def __init__(self, charts: Charts, catalogue: Catalogue, validation: Validation, shipped: ShippedChart, trial: Trial, environments: Environments) -> None:
        self.charts, self.catalogue, self.validation, self.shipped, self.trial, self.environments = charts, catalogue, validation, shipped, trial, environments

    def index(self, request: Request) -> Response:
        return Response.json({"workflows": [self.named(c) for c in self.charts.all()], "catalogue": self.entries()})

    def one(self, request: Request) -> Response:
        try:
            return Response.json(self.drawn(self.charts.find(int(request.params["id"]))))
        except NotFound as missing:
            return Response.not_found(str(missing))

    def create(self, request: Request) -> Response:
        """A workflow is born with its trigger: the event it starts at, named by its key, and a title that is the event's unless given."""
        trigger = next((e for e in self.catalogue.all() if e.kind == NodeKind.TRIGGER and e.key == request.body.get("trigger", "")), None)
        title = request.body.get("title", "").strip() or (trigger.title if trigger else "A workflow")
        taken = self.validation.taken_faults(Chart(title=title), [{"kind": NodeKind.TRIGGER, "key": trigger.key}]) if trigger else []
        if taken:
            return Response.refused(taken[0])
        chart = self.charts.save(Chart(title=title), request.actor)
        if trigger:
            self.charts.add_node(chart, Node(kind=NodeKind.TRIGGER, key=trigger.key, x=400, y=0), request.actor)
        return Response.json(self.drawn(chart), 201)

    def remove(self, request: Request) -> Response:
        chart = self.charts.find(int(request.params["id"]))
        if chart.shipped:
            return Response.refused("a shipped workflow stays; empty it or reset it instead")
        self.charts.remove(chart, request.actor)
        return Response.json({"removed": chart.id})

    def save(self, request: Request) -> Response:
        chart = self.charts.find(int(request.params["id"]))
        if int(request.body.get("revision", -1)) != chart.revision:
            return Response.refused(f"the workflow changed since you read it: it is at revision {chart.revision}, read it again")
        faults = self.validation.faults(chart, request.body.get("nodes", []), request.body.get("lines", []))
        if faults:
            return Response.refused("the workflow is not saved: " + "; ".join(faults))
        return Response.json(self.drawn(self.charts.replace(chart, request.body.get("nodes", []), request.body.get("lines", []), request.actor)))

    def try_(self, request: Request) -> Response:
        """A dry run: the path the chart would take for an agent event in an environment, and what it would do, nothing done."""
        environment = self.environments.named(request.body.get("environment", "main")).id
        body = request.body
        assumed = Assumptions(quiet=body.get("quiet"), edits=body.get("edits"), unread=body.get("unread"))
        return Response.json(self.trial.run(body.get("trigger", "idle"), environment, int(body.get("row", 0) or 0), assumed))

    def reset(self, request: Request) -> Response:
        chart = self.charts.find(int(request.params["id"]))
        if not chart.shipped:
            return Response.refused("only a shipped workflow has a shipped drawing to go back to")
        return Response.json(self.drawn(self.shipped.reset(chart, request.actor)))

    def named(self, chart: Chart) -> dict:
        sidelined = self.charts.sidelined_by(chart)
        return {"id": chart.id, "title": chart.title, "revision": chart.revision, "shipped": chart.shipped, "event": chart.event, "sidelined_by": sidelined.id if sidelined else None}

    def entries(self) -> list[dict]:
        return [{**asdict(e), "kind": e.kind.value} for e in self.catalogue.all()]

    def drawn(self, chart: Chart) -> dict:
        return {
            **self.named(chart), "shipped": chart.shipped,
            "nodes": [{"id": n.id, "kind": n.kind.value, "key": n.key, "text": n.text, "x": n.x, "y": n.y, "shipped": n.shipped} for n in self.charts.nodes_of(chart)],
            "lines": [{"from": line.source.id, "to": line.target.id, "port": line.kind} for line in self.charts.lines_of(chart)],
            "catalogue": self.entries(),
        }
