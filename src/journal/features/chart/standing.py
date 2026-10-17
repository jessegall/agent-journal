from journal.engine.machine import Machine
from journal.events.agent.ticked import Ticked
from journal.features.chart.checks import COUNT_CHECKS, Checks
from journal.features.chart.context import Context
from journal.features.chart.walk import WALKED
from journal.models.chart import Chart
from journal.models.node_kind import NodeKind
from journal.repositories.agents import Agents
from journal.repositories.charts import Charts
from journal.repositories.entries import Entries

READINGS = ("edits", "uses", "owed", "namings", "lines")
"""The counts the journal reads from its record rather than a workflow keeping them."""
LOOKED_BACK = 300
"""How many of the latest walks are read to find where each agent last stopped."""


class Standing:
    """Where each live agent stands in a workflow: the node its last walk of it stopped at, whether it waits there (a count check that answered no), the counts the workflow keeps for it, and the readings its count checks compare, with what each counts."""

    def __init__(self, charts: Charts, agents: Agents, entries: Entries, checks: Checks, machine: Machine) -> None:
        self.charts, self.agents, self.entries, self.checks, self.machine = charts, agents, entries, checks, machine

    def of(self, chart: Chart) -> dict:
        nodes = {n.id: n for n in self.charts.nodes_of(chart)}
        walks = self.entries.of_kind(WALKED, LOOKED_BACK)
        agents = [a for a in self.agents.in_() if a.state != "ended"]
        return {"agents": [self.agent(chart, nodes, walks, a) for a in agents], "readings": self.readings(nodes), "limits": self.limits(nodes)}

    def agent(self, chart: Chart, nodes: dict, walks: list, agent) -> dict:
        stop = next((s for w in walks if w.data.get("session") == agent.session for s in reversed(w.data.get("stops", ())) if s["workflow"] == chart.id), None)
        node = nodes.get(stop["node"]) if stop else None
        at = next((w.created_at.isoformat() for w in walks if stop and stop in w.data.get("stops", ())), "")
        ctx = Context(event=Ticked(at=0.0, quiet_for=0.0).placed(agent.session, agent.environment_id, agent.provider, 0.0), session=agent.session, environment_id=agent.environment_id, state=self.machine.current(agent.session))
        return {
            "session": agent.session, "n": agent.id,
            "node": stop["node"] if stop else 0, "port": stop["port"] if stop else "", "at": at,
            "waits": bool(node and node.key in COUNT_CHECKS and stop["port"] == "no"),
            "counts": self.checks.counts_kept(agent.session, chart.id),
            "readings": {name: self.checks.count_of(ctx, name) for name in self.read_by(nodes)},
        }

    def limits(self, nodes: dict) -> dict:
        """Each count check's number, a setting it names read as its value."""
        return {str(n.id): self.checks.number(n.text.strip().partition(" ")[2]) for n in nodes.values() if n.key in COUNT_CHECKS and n.text.strip().partition(" ")[2]}

    def readings(self, nodes: dict) -> dict:
        """What each reading a count check of the workflow compares counts, in plain words."""
        return {name: (getattr(self.checks, f"derived_{name}").__doc__ or "").strip() for name in self.read_by(nodes)}

    @staticmethod
    def read_by(nodes: dict) -> list[str]:
        names = [n.text.strip().partition(" ")[0] for n in nodes.values() if n.kind == NodeKind.CHECK and n.key in COUNT_CHECKS]
        return sorted({name for name in names if name in READINGS})
