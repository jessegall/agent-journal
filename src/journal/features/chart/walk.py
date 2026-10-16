import re
from dataclasses import replace

from journal.events.agent.ticked import Ticked
from journal.events.event import Event
from journal.events.models.model_event import ModelEvent
from journal.features.chart.actions import Actions
from journal.features.chart.checks import Checks
from journal.features.chart.context import Context
from journal.features.chart.dry_actions import DryActions
from journal.hooks.decision import Decision
from journal.engine.agent_state import AgentState
from journal.engine.machine import Machine
from journal.engine.states.paused import Paused
from journal.engine.states_catalogue import StatesCatalogue
from journal.models.actor import Actor
from journal.models.chart import Chart
from journal.models.entry import Entry
from journal.models.graph import Graph
from journal.models.node import Node
from journal.models.node_kind import NodeKind
from journal.repositories.charts import NO, THEN, YES, Charts
from journal.repositories.entries import Entries

STEPS = 50
MOVERS = ("release", "move_to")
"""The actions that move the agent: one of them per event, the first to act."""
"""A path is at most this long: a longer one is a loop the validation missed, and it stops here."""
WALKED = "walk"
FAILED = "walk_failed"
"""The entry a node leaves when answering or acting raised: the node, its key and the fault's words, so the page can show it; the path ends there and the walk goes on."""
"""The entry a walk leaves when a trigger fired: the nodes it passed and what it did, so the viewer can say why."""


class Walk:
    """The engine walking every workflow for one event: each trigger node for the event starts a path; a check sends it on by its answer; an action acts and sends it on by then. The workflows are read fresh each time, so an edit applies at the next event."""

    def __init__(self, charts: Charts, checks: Checks, actions: Actions, entries: Entries, states: StatesCatalogue, machine: Machine) -> None:
        self.charts, self.checks, self.actions, self.entries, self.states, self.machine = charts, checks, actions, entries, states, machine

    def dry(self, fillers, checks: Checks) -> "Walk":
        """The same walk with nothing done: each action tells what it would do, and the checks given answer, assumed or live."""
        return Walk(self.charts, checks, DryActions(fillers), self.entries, self.states, self.machine)

    def on(self, ctx: Context) -> Decision:
        return self.on_with_trace(ctx, [])

    def on_with_trace(self, ctx: Context, passed: list) -> Decision:
        """The walk, with the nodes it passes written into the list given: the event's workflows in their order; a move inside one re-reads the state, and the new state's workflows that come later in the order run at their place."""
        key, decision = self.trigger_key(ctx.event), Decision()
        walked, graphs, queue = [], [], self.workflows_for(ctx, key)
        while queue:
            chart = queue.pop(0)
            walked.append(chart)
            graph = self.charts.graph(chart)
            graphs.append(graph)
            moves_before = len(ctx.moves)
            for start in graph.triggers.get(key, ()):
                decision = decision.merged(self.follow(graph.nodes[start], graph.nodes, graph.after, ctx, passed))
            if len(ctx.moves) > moves_before:
                ctx = replace(ctx, state=ctx.moves[-1][1])
                queue = [c for c in self.workflows_for(ctx, key) if c not in walked and c.place > chart.place]
        if self.worth_recording(ctx.event, graphs, passed) and not isinstance(self.actions, DryActions):
            self.entries.save(Entry(environment_id=ctx.environment_id, kind=WALKED, actor=Actor.system(), data={"session": ctx.session, "state": ctx.state.name if ctx.state else "", "workflows": [c.id for c in walked], "trigger": key, "nodes": passed, "allowed": decision.allowed, "said": decision.context or decision.reason, "unanswered": list(ctx.unanswered), "moved_by": [n for n, _ in ctx.moves]}), Actor.system())
        return decision

    @staticmethod
    def worth_recording(event: Event, graphs: list[Graph], passed: list) -> bool:
        """A walk that passed a node is recorded, a tick's only when it acted: the clock ticks every few seconds and a quiet tick is no news."""
        if not passed:
            return False
        if not isinstance(event, Ticked):
            return True
        return any(graph.nodes[n].kind == NodeKind.ACTION for graph in graphs for n in passed if n in graph.nodes)

    def workflows_for(self, ctx: Context, key: str) -> list[Chart]:
        """The event's workflows in the order the user set: the ones bound to no state always, and the ones bound to the agent's state, or to the nearest state it inherits from that has any at this event, whose workflows replace its parents' there; the state beneath an owed pause counts too."""
        answering = self.charts.for_event(key)
        bound = set()
        for state in self.states_of(ctx):
            nearest = next((name for name in self.lineage(state) if any(c.state == name for c in answering)), None)
            if nearest:
                bound.add(nearest)
        return [c for c in answering if not c.state or c.state in bound]

    def states_of(self, ctx: Context) -> list[AgentState]:
        """The state the walk read, and beneath a pause the agent owes the journal the state it interrupted, so the conduct of that state, its inbox, its holds, its waits, still runs under the pause. A tick is about the agent's quiet, and under an owed pause the quiet is the pause's: the state beneath says nothing on it."""
        if not ctx.state:
            return []
        beneath = self.states.beneath(ctx.state)
        if beneath is ctx.state or isinstance(ctx.event, Ticked):
            return [ctx.state]
        return [ctx.state, beneath]

    @staticmethod
    def lineage(state: AgentState) -> list[str]:
        """The state's name and then its parents', nearest first: following a plan is a kind of working, and every pause is a kind of paused."""
        names = [getattr(cls, "name", "") for cls in type(state).__mro__ if issubclass(cls, AgentState) and cls is not AgentState]
        return [n for i, n in enumerate(names) if n and n not in names[:i]]

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
                port = NO if node.kind == NodeKind.CHECK else THEN
            at += after.get((node.id, port), [])
        if at:
            self.failed(node, ctx, RuntimeError(f"the path ran past {STEPS} nodes and was cut off"))
        return decision

    def step(self, node: Node, ctx: Context, decision: Decision) -> tuple[str, Decision]:
        """One node: a check answers with the port to leave by, an action acts and leaves by then, a trigger leaves by then. The first hold of the event wins and a later one is recorded unanswered; a second move in one event is refused."""
        if node.kind == NodeKind.CHECK:
            return (YES if self.checks.answer(node.key, ctx, node.text) else NO), decision
        if node.kind != NodeKind.ACTION:
            return THEN, decision
        if node.key in MOVERS and ctx.moves:
            return THEN, decision.merged(self.second_move(node, ctx))
        acted = self.actions.perform(node.key, node.text, ctx)
        if node.key in MOVERS:
            landed = self.landed(node, ctx)
            if landed is not None:
                ctx.moves.append((node.id, landed))
        if not acted.allowed:
            if ctx.held:
                ctx.unanswered.append(node.id)
                acted = Decision.tell(acted.context)
            else:
                ctx.held.append(node.id)
        return THEN, decision.merged(acted)

    def second_move(self, node: Node, ctx: Context) -> Decision:
        """A second move in one event is refused and recorded, naming both nodes; a dry run says it would be."""
        first = ctx.moves[0][0]
        if isinstance(self.actions, DryActions):
            return Decision.tell(f"would refuse a second move at node {node.id}: node {first} moved the agent first")
        self.failed(node, ctx, RuntimeError(f"a second move in one event, refused: node {first} moved the agent first"))
        return Decision()

    def landed(self, node: Node, ctx: Context) -> AgentState | None:
        """The state a move left the agent in, read again from the machine; in a dry run, the state the move would lead to."""
        if not ctx.session or not ctx.state:
            return None
        if not isinstance(self.actions, DryActions):
            now = self.machine.current(ctx.session)
            return now if now.name != ctx.state.name or now.to_data() != ctx.state.to_data() else None
        if node.key == "move_to":
            name = node.text.strip().partition(" ")[0]
            return self.states.named(name, {}) if self.states.known(name) else None
        return self.states.named(ctx.state.resume.get("state", "idle"), ctx.state.resume.get("data", {})) if isinstance(ctx.state, Paused) else None

    def failed(self, node: Node, ctx: Context, fault: Exception) -> None:
        """A node that raised is recorded where the page can show it, and the path goes on past it, by no from a check and by then from an action, so one broken step never silences what follows. The ruling behind the catch is in NOTES, under the chart."""
        self.entries.save(Entry(environment_id=ctx.environment_id, kind=FAILED, actor=Actor.system(), data={"session": ctx.session, "workflow": self.charts.chart_of(node).id, "node": node.id, "key": node.key, "fault": f"{type(fault).__name__}: {fault}"}), Actor.system())

    @staticmethod
    def trigger_key(event: Event) -> str:
        """An agent event by its name as the catalogue spells it, Idle as idle and ToolStarting as tool_starting; a row event as table.moment."""
        if isinstance(event, ModelEvent):
            return f"{event.model.table()}.{type(event).__name__.lower()}"
        return re.sub(r"(?<!^)(?=[A-Z])", "_", type(event).__name__).lower()
