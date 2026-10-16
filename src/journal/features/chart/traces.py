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

    def recent(self, limit: int) -> list[dict]:
        """The newest walks across every workflow, newest first: when, which workflows, at which event, what was said, and whether a node failed in it."""
        failures = self.entries.of_kind(FAILED, LOOK_BACK)
        runs = []
        for walk in self.entries.of_kind(WALKED, LOOK_BACK)[:limit]:
            at = walk.created_at.timestamp()
            runs.append({"at": at, "workflows": walk.data.get("workflows", []), "nodes": walk.data.get("nodes", []), "trigger": self.trigger_title(walk.data["trigger"]), "event": walk.data["trigger"], "state": walk.data.get("state", ""), "started": walk.data.get("started", walk.data.get("state", "")), "moved_to": walk.data.get("moved_to", ""), "moved_by": walk.data.get("moved_by", []), "row": walk.data.get("row", 0), "read": walk.data.get("read", {}), "allowed": walk.data.get("allowed", True), "said": walk.data.get("said", ""),
                         "failed": any(abs(f.created_at.timestamp() - at) < 1 and f.data.get("workflow") in walk.data.get("workflows", []) for f in failures)})
        return runs

    def node_runs(self, chart: Chart) -> dict[int, dict]:
        """How often each of the workflow's nodes ran and when last, from the walks on record."""
        own, runs = {node.id for node in self.charts.nodes_of(chart)}, {}
        for walk in self.entries.of_kind(WALKED, LOOK_BACK):
            for n in set(walk.data.get("nodes", [])) & own:
                runs.setdefault(n, {"runs": 0, "last": walk.created_at.timestamp()})["runs"] += 1
        return runs

    def trigger_title(self, key: str) -> str:
        return self.catalogue.entry(NodeKind.TRIGGER, key).title if self.catalogue.has(NodeKind.TRIGGER, key) else key
