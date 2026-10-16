import re

from journal.events.event import Event
from journal.events.models.model_event import ModelEvent
from journal.features.chart.actions import Actions
from journal.features.chart.checks import Checks
from journal.features.chart.context import Context
from journal.features.chart.dry_actions import DryActions
from journal.hooks.decision import Decision
from journal.models.actor import Actor
from journal.models.entry import Entry
from journal.models.node import Node
from journal.models.node_kind import NodeKind
from journal.repositories.charts import NO, THEN, YES, Charts
from journal.repositories.entries import Entries

STEPS = 50
"""A path is at most this long: a longer one is a loop the validation missed, and it stops here."""
WALKED = "walk"
FAILED = "walk_failed"
"""The entry a node leaves when answering or acting raised: the node, its key and the fault's words, so the page can show it; the path ends there and the walk goes on."""
"""The entry a walk leaves when a trigger fired: the nodes it passed and what it did, so the viewer can say why."""


class Walk:
    """The engine walking every workflow for one event: each trigger node for the event starts a path; a check sends it on by its answer; an action acts and sends it on by then. The workflows are read fresh each time, so an edit applies at the next event."""

    def __init__(self, charts: Charts, checks: Checks, actions: Actions, entries: Entries) -> None:
        self.charts, self.checks, self.actions, self.entries = charts, checks, actions, entries

    def dry(self, fillers, checks: Checks) -> "Walk":
        """The same walk with nothing done: each action tells what it would do, and the checks given answer, assumed or live."""
        return Walk(self.charts, checks, DryActions(fillers), self.entries)

    def on(self, ctx: Context) -> Decision:
        return self.on_with_trace(ctx, [])

    def on_with_trace(self, ctx: Context, passed: list) -> Decision:
        """The walk, with the nodes it passes written into the list given."""
        key, decision = self.trigger_key(ctx.event), Decision()
        for chart in self.charts.all():
            nodes = {node.id: node for node in self.charts.nodes_of(chart)}
            after = {}
            for line in self.charts.lines_of(chart):
                after.setdefault((line.source.id, line.kind), []).append(line.target.id)
            for start in [n for n in nodes.values() if n.kind == NodeKind.TRIGGER and n.key == key]:
                decision = decision.merged(self.follow(start, nodes, after, ctx, passed))
        if passed and not isinstance(self.actions, DryActions):
            self.entries.save(Entry(environment_id=ctx.environment_id, kind=WALKED, actor=Actor.system(), data={"session": ctx.session, "trigger": key, "nodes": passed, "allowed": decision.allowed, "said": decision.context or decision.reason}), Actor.system())
        return decision

    def follow(self, start: Node, nodes: dict, after: dict, ctx: Context, passed: list) -> Decision:
        decision, at, steps = Decision(), [start.id], 0
        while at and steps < STEPS:
            steps += 1
            node = nodes[at.pop(0)]
            passed.append(node.id)
            try:
                port, decision = self.step(node, ctx, decision)
            except Exception as fault:
                self.failed(node, ctx, fault)
                break
            at += after.get((node.id, port), [])
        return decision

    def step(self, node: Node, ctx: Context, decision: Decision) -> tuple[str, Decision]:
        """One node: a check answers with the port to leave by, an action acts and leaves by then, a trigger leaves by then."""
        if node.kind == NodeKind.CHECK:
            return (YES if self.checks.answer(node.key, ctx, node.text) else NO), decision
        if node.kind == NodeKind.ACTION:
            return THEN, decision.merged(self.actions.perform(node.key, node.text, ctx))
        return THEN, decision

    def failed(self, node: Node, ctx: Context, fault: Exception) -> None:
        """A node that raised ends its path, and leaves what happened where the page can show it: the other paths still answer. The ruling behind the catch is in NOTES, under the chart."""
        self.entries.save(Entry(environment_id=ctx.environment_id, kind=FAILED, actor=Actor.system(), data={"session": ctx.session, "node": node.id, "key": node.key, "fault": f"{type(fault).__name__}: {fault}"}), Actor.system())

    @staticmethod
    def trigger_key(event: Event) -> str:
        """An agent event by its name as the catalogue spells it, Idle as idle and ToolStarting as tool_starting; a row event as table.moment."""
        if isinstance(event, ModelEvent):
            return f"{event.model.table()}.{type(event).__name__.lower()}"
        return re.sub(r"(?<!^)(?=[A-Z])", "_", type(event).__name__).lower()
