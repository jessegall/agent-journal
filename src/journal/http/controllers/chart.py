from dataclasses import asdict

from journal.features.chart.catalogue import Catalogue
from journal.features.chart.seeds.shipped_chart import ShippedChart
from journal.features.chart.trial import Trial
from journal.features.chart.validation import Validation
from journal.http.request import Request
from journal.http.response import Response
from journal.repositories.charts import Charts
from journal.repositories.environments import Environments


class ChartController:
    """The chart page: the one chart with its nodes, lines and catalogue, read whole and saved whole as the user."""

    def __init__(self, charts: Charts, catalogue: Catalogue, validation: Validation, shipped: ShippedChart, trial: Trial, environments: Environments) -> None:
        self.charts, self.catalogue, self.validation, self.shipped, self.trial, self.environments = charts, catalogue, validation, shipped, trial, environments

    def index(self, request: Request) -> Response:
        return Response.json(self.drawn())

    def save(self, request: Request) -> Response:
        chart = self.charts.the()
        if int(request.body.get("revision", -1)) != chart.revision:
            return Response.refused(f"the chart changed since you read it: it is at revision {chart.revision}, read it again")
        faults = self.validation.faults(request.body.get("nodes", []), request.body.get("lines", []))
        if faults:
            return Response.refused("the chart is not saved: " + "; ".join(faults))
        self.charts.replace(chart, request.body.get("nodes", []), request.body.get("lines", []), request.actor)
        return Response.json(self.drawn())

    def try_(self, request: Request) -> Response:
        """A dry run: the path the chart would take for an agent event in an environment, and what it would do, nothing done."""
        environment = self.environments.named(request.body.get("environment", "main")).id
        return Response.json(self.trial.run(request.body.get("trigger", "idle"), environment))

    def reset(self, request: Request) -> Response:
        self.shipped.reset(request.actor)
        return Response.json(self.drawn())

    def drawn(self) -> dict:
        chart = self.charts.the()
        return {
            "title": chart.title, "revision": chart.revision,
            "nodes": [{"id": n.id, "kind": n.kind.value, "key": n.key, "text": n.text, "x": n.x, "y": n.y, "shipped": n.shipped} for n in self.charts.nodes_of(chart)],
            "lines": [{"from": line.source.id, "to": line.target.id, "port": line.kind} for line in self.charts.lines_of(chart)],
            "catalogue": [{**asdict(e), "kind": e.kind.value} for e in self.catalogue.all()],
        }
