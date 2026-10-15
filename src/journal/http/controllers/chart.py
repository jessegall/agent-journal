from dataclasses import asdict

from journal.features.chart.catalogue import Catalogue
from journal.features.chart.seeds.shipped_chart import ShippedChart
from journal.features.chart.validation import Validation
from journal.http.request import Request
from journal.http.response import Response
from journal.repositories.charts import Charts


class ChartController:
    """The chart page: the one chart with its nodes, lines and catalogue, read whole and saved whole as the user."""

    def __init__(self, charts: Charts, catalogue: Catalogue, validation: Validation, shipped: ShippedChart) -> None:
        self.charts, self.catalogue, self.validation, self.shipped = charts, catalogue, validation, shipped

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
