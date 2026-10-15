import re

from journal.events.event import Event
from journal.events.models.model_event import ModelEvent
from journal.features.chart.actions import Actions
from journal.features.chart.checks import Checks
from journal.features.chart.context import Context
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
"""The entry a walk leaves when a trigger fired: the nodes it passed and what it did, so the viewer can say why."""


class Walk:
    """The engine walking the chart for one event: every trigger node for the event starts a path; a check sends it on by its answer; an action acts and sends it on by then. The chart is read fresh each time, so an edit applies at the next event."""

    def __init__(self, charts: Charts, checks: Checks, actions: Actions, entries: Entries) -> None:
        self.charts, self.checks, self.actions, self.entries = charts, checks, actions, entries

    def on(self, ctx: Context) -> Decision:
        charts = self.charts.all()
        if not charts:
            return Decision()
        key, chart = self.trigger_key(ctx.event), charts[0]
        nodes = {node.id: node for node in self.charts.nodes_of(chart)}
        after = {}
        for line in self.charts.lines_of(chart):
            after.setdefault((line.source.id, line.kind), []).append(line.target.id)
        decision, passed = Decision(), []
        for start in [n for n in nodes.values() if n.kind == NodeKind.TRIGGER and n.key == key]:
            decision = decision.merged(self.follow(start, nodes, after, ctx, passed))
        if passed:
            self.entries.save(Entry(environment_id=ctx.environment_id, kind=WALKED, actor=Actor.system(), data={"session": ctx.session, "trigger": key, "nodes": passed, "allowed": decision.allowed, "said": decision.context or decision.reason}), Actor.system())
        return decision

    def follow(self, start: Node, nodes: dict, after: dict, ctx: Context, passed: list) -> Decision:
        decision, at, steps = Decision(), [start.id], 0
        while at and steps < STEPS:
            steps += 1
            node = nodes[at.pop(0)]
            passed.append(node.id)
            if node.kind == NodeKind.CHECK:
                port = YES if self.checks.answer(node.key, ctx) else NO
            else:
                port = THEN
                if node.kind == NodeKind.ACTION:
                    decision = decision.merged(self.actions.perform(node.key, node.text, ctx))
            at += after.get((node.id, port), [])
        return decision

    @staticmethod
    def trigger_key(event: Event) -> str:
        """An agent event by its name as the catalogue spells it, Idle as idle and ToolStarting as tool_starting; a row event as table.moment."""
        if isinstance(event, ModelEvent):
            return f"{event.model.table()}.{type(event).__name__.lower()}"
        return re.sub(r"(?<!^)(?=[A-Z])", "_", type(event).__name__).lower()
