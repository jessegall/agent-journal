from datetime import datetime, timezone

from journal.engine.machine import Machine
from journal.events.agent.ticked import Ticked
from journal.features.chart.agent_standing import AgentStanding
from journal.features.chart.checks import COUNT_CHECKS, READINGS, Checks
from journal.features.chart.context import Context
from journal.features.chart.walk import WALKED
from journal.features.chart.workflow_standing import WorkflowStanding
from journal.features.registry import Registry
from journal.models.chart import Chart
from journal.models.node_kind import NodeKind
from journal.models.walk_record import WalkRecord
from journal.repositories.agents import Agents
from journal.repositories.charts import Charts
from journal.repositories.entries import Entries

LOOKED_BACK = 300
"""How many of the latest walks are read to find where each agent last stopped."""


class Standing:
    """Where each live agent stands in a workflow: the node its last walk of it stopped at, whether it waits there (a count check that answered no), the counts the workflow keeps for it, and the readings its count checks compare, with what each counts."""

    def __init__(self, charts: Charts, agents: Agents, entries: Entries, checks: Checks, machine: Machine, registry: Registry) -> None:
        self.charts, self.agents, self.entries, self.checks, self.machine, self.registry = charts, agents, entries, checks, machine, registry

    def of(self, chart: Chart) -> WorkflowStanding:
        nodes = {n.id: n for n in self.charts.nodes_of(chart)}
        walks = [WalkRecord.from_entry(e) for e in self.entries.of_kind(WALKED, LOOKED_BACK)]
        agents = [a for a in self.agents.in_() if a.state != "ended"]
        return WorkflowStanding(agents=[self.agent(chart, nodes, walks, a) for a in agents], readings=self.readings(nodes), limits=self.limits(nodes))

    def agent(self, chart: Chart, nodes: dict, walks: list[WalkRecord], agent) -> AgentStanding:
        walk, stop = next(((w, s) for w in walks if w.session == agent.session for s in reversed(w.stops) if s.waits_at(chart.id)), (None, None))
        node = nodes.get(stop.node) if stop else None
        at = datetime.fromtimestamp(walk.at, timezone.utc).isoformat() if walk else ""
        ctx = Context(event=Ticked(at=0.0, quiet_for=0.0).placed(agent.session, agent.environment_id, agent.provider, 0.0), session=agent.session, environment_id=agent.environment_id, state=self.machine.current(agent.session))
        return AgentStanding(session=agent.session, n=agent.id, node=stop.node if stop else 0, port=stop.port if stop else "", at=at,
                             waits=bool(node and node.key in COUNT_CHECKS and stop.port == "no"), counts=self.checks.counts_kept(agent.session, chart.id),
                             readings={name: self.checks.count_of(ctx, name) for name in self.read_by(nodes)})

    def limits(self, nodes: dict) -> dict:
        """Each count check's number, and when its text names a setting, that setting's title, so the card says the number and where it comes from."""
        titles = {o.key: o.title for o in self.registry.options()}
        named = {str(n.id): n.text.strip().partition(" ")[2] for n in nodes.values() if n.key in COUNT_CHECKS and n.text.strip().partition(" ")[2]}
        return {node: {"number": self.checks.number(text), "setting": titles.get(text, "")} for node, text in named.items()}

    def readings(self, nodes: dict) -> dict:
        """What each reading a count check of the workflow compares counts, in plain words."""
        return {name: (getattr(self.checks, f"derived_{name}").__doc__ or "").strip() for name in self.read_by(nodes)}

    @staticmethod
    def read_by(nodes: dict) -> list[str]:
        names = [n.text.strip().partition(" ")[0] for n in nodes.values() if n.kind == NodeKind.CHECK and n.key in COUNT_CHECKS]
        return sorted({name for name in names if name in READINGS})
