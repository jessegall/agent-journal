from journal.features.chart.catalogue import Catalogue
from journal.features.chart.walk import FAILED, WALKED
from journal.models.chart import Chart
from journal.models.entry import Entry
from journal.models.node_kind import NodeKind
from journal.repositories.charts import Charts
from journal.repositories.entries import Entries

LOOK_BACK = 400
"""How many of the newest walk entries are read to find a workflow's last one."""


class Traces:
    """What the page says about a workflow's last walk and its last failure, read from the entries the walk leaves."""

    def __init__(self, entries: Entries, catalogue: Catalogue, charts: Charts) -> None:
        self.entries, self.catalogue, self.charts = entries, catalogue, charts

    def last_walk(self, chart: Chart) -> dict:
        """The newest walk that passed through one of this workflow's own nodes, with those nodes alone: a walk that consulted it and found no trigger for the event is not its."""
        own = {node.id for node in self.charts.nodes_of(chart)}
        walk = next((e for e in self.entries.of_kind(WALKED, LOOK_BACK) if own.intersection(e.data.get("nodes", []))), None)
        if walk is None:
            return {}
        return {"at": walk.created_at.timestamp(), "trigger": self.trigger_title(walk.data["trigger"]), "nodes": [n for n in walk.data["nodes"] if n in own], "said": walk.data.get("said", ""), "allowed": walk.data.get("allowed", True)}

    def last_failure(self, chart: Chart) -> dict:
        failed = next((e for e in self.entries.of_kind(FAILED, LOOK_BACK) if e.data.get("workflow") == chart.id), None)
        if failed is None:
            return {}
        return {"at": failed.created_at.timestamp(), "node": failed.data["node"], "key": failed.data["key"], "fault": failed.data["fault"]}

    def trigger_title(self, key: str) -> str:
        return self.catalogue.entry(NodeKind.TRIGGER, key).title if self.catalogue.has(NodeKind.TRIGGER, key) else key
