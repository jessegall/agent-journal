from dataclasses import replace

from journal.support.chart_catalogue import ChartCatalogue
from journal.features.chart.support.walk import FAILED, WALKED
from journal.support.states_catalogue import StatesCatalogue
from journal.models.chart import Chart
from journal.models.node_kind import NodeKind
from journal.support.walk_failure import WalkFailure
from journal.support.walk_record import WalkRecord
from journal.support.walk_run import WalkRun
from journal.repositories.charts import Charts
from journal.repositories.entries import Entries

LOOK_BACK = 400
"""How many of the newest walk entries are read to find a workflow's last one."""


class Traces:
    """What the page says about a workflow's last walk and its last failure, read from the entries the walk leaves."""

    def __init__(self, entries: Entries, catalogue: ChartCatalogue, charts: Charts, states: StatesCatalogue) -> None:
        self.entries, self.catalogue, self.charts, self.states = entries, catalogue, charts, states

    def last_walk(self, chart: Chart) -> WalkRun | None:
        """The newest walk that passed through one of this workflow's own nodes, with those nodes alone: a walk that consulted it and found no trigger for the event is not its."""
        own = {node.id for node in self.charts.nodes_of(chart)}
        walk = next((w for w in self.walks() if w.passed_any(own)), None)
        if walk is None:
            return None
        return self.run_of(replace(walk, nodes=tuple(n for n in walk.nodes if n in own)), False)

    def last_failure(self, chart: Chart) -> WalkFailure | None:
        return next((f for f in self.failures() if f.workflow == chart.id), None)

    def recent(self, limit: int) -> list[WalkRun]:
        """The newest walks across every workflow, newest first, each with its event's title and whether a node failed in it."""
        failures = self.failures()
        return [self.run_of(walk, any(abs(f.at - walk.at) < 1 and f.workflow in walk.workflows for f in failures)) for walk in self.walks()[:limit]]

    def run_of(self, walk: WalkRecord, failed: bool) -> WalkRun:
        return WalkRun(walk, self.trigger_title(walk.trigger), failed, self.state_title(walk.started), self.state_title(walk.moved_to))

    def state_title(self, name: str) -> str:
        return self.states.title_of(name) if name else ""

    def walks(self) -> list[WalkRecord]:
        return [WalkRecord.from_entry(e) for e in self.entries.of_kind(WALKED, LOOK_BACK)]

    def failures(self) -> list[WalkFailure]:
        return [WalkFailure.from_entry(e) for e in self.entries.of_kind(FAILED, LOOK_BACK)]

    def node_runs(self, chart: Chart) -> dict[int, dict]:
        """How often each of the workflow's nodes ran and when last, from the walks on record."""
        own, runs = {node.id for node in self.charts.nodes_of(chart)}, {}
        for walk in self.walks():
            for n in set(walk.nodes) & own:
                runs.setdefault(n, {"runs": 0, "last": walk.at})["runs"] += 1
        return runs

    def trigger_title(self, key: str) -> str:
        return self.catalogue.entry(NodeKind.TRIGGER, key).title if self.catalogue.has(NodeKind.TRIGGER, key) else key
