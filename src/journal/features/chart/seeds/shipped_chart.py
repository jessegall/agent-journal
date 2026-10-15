from journal.features.seed import Seed
from journal.models.actor import Actor
from journal.models.chart import Chart
from journal.repositories.charts import Charts

TITLE = "The journal's conduct"


class ShippedChart(Seed):
    """The one chart of the journal, made once; its shipped nodes come with the walk."""

    def __init__(self, charts: Charts) -> None:
        self.charts = charts

    def run(self) -> None:
        if not self.charts.all():
            self.charts.save(Chart(title=TITLE), Actor.system())
