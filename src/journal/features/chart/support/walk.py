from dataclasses import replace

from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.tool_starting import ToolStarting
from journal.events.event import Event
from journal.events.models.model_event import ModelEvent
from journal.features.chart.support.actions import Actions
from journal.features.chart.support.checks import COUNT_CHECKS, TIME_CHECKS, VALUE_ACTIONS, Checks
from journal.features.chart.support.context import Context
from journal.features.chart.support.dry_actions import DryActions
from journal.support.decision import Decision
from journal.support.floor import Floor
from journal.engine.agent_state import AgentState
from journal.engine.state_machine import StateMachine
from journal.engine.states.paused import Paused
from journal.support.states_catalogue import StatesCatalogue
from journal.support.actor import Actor
from journal.models.chart import Chart
from journal.models.entry import Entry
from journal.support.graph import Graph
from journal.models.node import Node
from journal.models.node_kind import NodeKind
from journal.support.walk_failure import WalkFailure
from journal.support.walk_record import WalkRecord
from journal.support.walk_stop import WalkStop
from journal.support.drawn_line import NO, THEN, YES
from journal.repositories.charts import Charts
from journal.repositories.entries import Entries

STEPS = 50
ALL, BEFORE, AFTER = "all", "before", "after"
"""Which of an event's workflows a walk takes: all of them, those walked before the hook's reply, or the quiet ones after it."""
MOVERS = ("release", "wait_outside", "mark_stuck", "go_idle")
"""The actions that move the agent: one of them per event, the first to act."""
"""A path is at most this long: a longer one is a loop the validation missed, and it stops here."""
WALKED = "walk"
FAILED = "walk_failed"
"""The entry a node leaves when answering or acting raised: the node, its key and the fault's words, so the page can show it; the path ends there and the walk goes on."""
"""The entry a walk leaves when a trigger fired: the nodes it passed and what it did, so the viewer can say why."""


class Walk:
    """The engine walking every workflow for one event: each trigger node for the event starts a path; a check sends it on by its answer; an action acts and sends it on by then. The workflows are read fresh each time, so an edit applies at the next event."""

    def __init__(self, charts: Charts, checks: Checks, actions: Actions, entries: Entries, states: StatesCatalogue, machine: StateMachine, floor: Floor) -> None:
        self.charts, self.checks, self.actions, self.entries, self.states, self.machine, self.floor = charts, checks, actions, entries, states, machine, floor
        self._stopped_at: dict[int, int] = {}

    def dry(self, fillers, checks: Checks, ledger: dict) -> "Walk":
        """The same walk with nothing done: each action tells what it would do, the checks given answer, assumed or live, and the counts the dry walk makes are read through the ledger shared with them."""
        return Walk(self.charts, checks, DryActions(fillers.reading(checks), ledger), self.entries, self.states, self.machine, self.floor)

    def on(self, ctx: Context, part: str = ALL) -> Decision:
        """The walk's decision under the floor: no workflow holds a journal command or the read of a skill's file, the ways a debt is paid; the hold's words still reach the agent. The part says which workflows walk: those that can change the answer before the reply, the quiet ones after it, or all."""
        return self.floor.under(ctx.event, self.on_with_trace(ctx, [], part))

    def on_with_trace(self, ctx: Context, passed: list, part: str = ALL) -> Decision:
        """The walk, with the nodes it passes written into the list given: the event's workflows in their order; a move inside one re-reads the state, and the new state's workflows that come later in the order run at their place."""
        key, decision, started = self.trigger_key(ctx.event), Decision(), ctx.state
        walked, graphs, queue = [], [], self.in_part(self.workflows_for(ctx, key), ctx.event, part)
        while queue:
            chart = queue.pop(0)
            walked.append(chart)
            ctx.walked.append(chart.id)
            graph = self.charts.graph(chart)
            graphs.append(graph)
            moves_before = len(ctx.moves)
            for start in graph.triggers.get(key, ()):
                decision = decision.merged(self.follow(graph.nodes[start], graph.nodes, graph.after, ctx, passed))
            if ctx.stopped:
                self._stopped_at[id(ctx.event)] = chart.place_at(key)
                queue = []
            elif len(ctx.moves) > moves_before:
                ctx = replace(ctx, state=ctx.moves[-1][1])
                queue = [c for c in self.in_part(self.workflows_for(ctx, key), ctx.event, part) if c not in walked and c.place_at(key) > chart.place_at(key)]
        if self.worth_recording(ctx.event, graphs, passed) and not isinstance(self.actions, DryActions):
            record = WalkRecord(session=ctx.session, state=ctx.state.name if ctx.state else "", started=started.name if started else "", workflows=tuple(c.id for c in walked), trigger=key, nodes=tuple(passed), allowed=decision.allowed, said=decision.context or decision.reason,
                                unanswered=tuple(ctx.unanswered), moved_by=tuple(n for n, _ in ctx.moves), stopped_at=ctx.stopped[0] if ctx.stopped else 0, moved_to=ctx.moves[-1][1].name if ctx.moves else "",
                                row=ctx.event.model.id if isinstance(ctx.event, ModelEvent) else 0, read={str(k): v for k, v in ctx.read.items()}, stops=ctx.stops_counted(self.checks.counts_kept))
            self.entries.save(Entry(environment_id=ctx.environment_id, kind=WALKED, actor=Actor.system(), data=record.to_data()), Actor.system())
        return decision

    def in_part(self, charts: list[Chart], event: Event, part: str) -> list[Chart]:
        """The workflows of the part asked for: before the reply those that can change the answer, after it the quiet ones placed before any that ended the walk."""
        if part == BEFORE:
            return [c for c in charts if self.charts.graph(c).answers]
        if part == AFTER:
            stopped = self._stopped_at.pop(id(event), None)
            return [c for c in charts if not self.charts.graph(c).answers and (stopped is None or c.place_at(event.key) < stopped)]
        return charts

    @staticmethod
    def worth_recording(event: Event, graphs: list[Graph], passed: list) -> bool:
        """A walk that passed a node is recorded; one of an event no hook waits on, a tick or a line said, only when it did more than keep a value, since they come every few seconds and a quiet one is no news."""
        if not passed:
            return False
        if not isinstance(event, AgentEvent) or event.answers_hook:
            return True
        return any(graph.nodes[n].kind == NodeKind.ACTION and graph.nodes[n].key not in VALUE_ACTIONS for graph in graphs for n in passed if n in graph.nodes)

    def workflows_for(self, ctx: Context, key: str) -> list[Chart]:
        """The event's workflows in the order the user set: the ones bound to no state always, and the ones bound to the agent's state or to any state it inherits from, so following a plan runs Working's workflows and its own."""
        answering = self.charts.for_event(key)
        bound = {name for state in self.states_of(ctx) for name in self.lineage(state)}
        return [c for c in answering if not c.state or c.state in bound]

    def states_of(self, ctx: Context) -> list[AgentState]:
        """The state the walk read: what the agent owes the journal is a fact on its row, never a state over this one."""
        return [ctx.state] if ctx.state else []

    @staticmethod
    def lineage(state: AgentState) -> list[str]:
        """The state's name and then its parents', nearest first: following a plan is a kind of working, and every pause is a kind of paused."""
        names = [getattr(cls, "name", "") for cls in type(state).__mro__ if issubclass(cls, AgentState) and cls is not AgentState]
        return [n for i, n in enumerate(names) if n and n not in names[:i]]

    def follow(self, start: Node, nodes: dict, after: dict, ctx: Context, passed: list) -> Decision:
        decision, at, steps = Decision(), [start.id], 0
        while at and steps < STEPS and not ctx.stopped:
            steps += 1
            node = nodes[at.pop(0)]
            passed.append(node.id)
            try:
                port, decision = self.step(node, ctx, decision, passed)
            except Exception as fault:
                self.failed(node, ctx, fault)
                port = NO if node.kind == NodeKind.CHECK else THEN
            following = after.get((node.id, port), [])
            if not following:
                ctx.stops.append(WalkStop(ctx.workflow, node.id, port))
            at += following
        if at and not ctx.stopped:
            self.failed(node, ctx, RuntimeError(f"the path ran past {STEPS} nodes and was cut off"))
        return decision

    def step(self, node: Node, ctx: Context, decision: Decision, passed: list) -> tuple[str, Decision]:
        """One node: a check answers with the port to leave by, an action acts and leaves by then, a trigger leaves by then. The first hold of the event wins and a later one is recorded unanswered; a second move in one event is refused."""
        if node.kind == NodeKind.CHECK:
            if node.key in COUNT_CHECKS:
                ctx.read[node.id] = self.checks.count_of(ctx, node.text.strip().partition(" ")[0])
            if node.key in TIME_CHECKS:
                ctx.read[node.id] = self.checks.seconds_since(ctx, node.text.strip().partition(" ")[0])
            return (YES if self.checks.answer(node.key, ctx, node.text) else NO), decision
        if node.kind != NodeKind.ACTION:
            return THEN, decision
        if node.key == "stop_here":
            ctx.stopped.append(node.id)
            return THEN, decision.merged(self.actions.perform(node.key, node.text, ctx))
        if node.key == "run_workflow":
            return THEN, decision.merged(self.run_workflow(node, ctx, passed))
        if node.key in MOVERS and ctx.moves:
            return THEN, decision.merged(self.second_move(node, ctx))
        if node.key in VALUE_ACTIONS:
            if node.id in ctx.valued:
                return THEN, decision
            ctx.valued.add(node.id)
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
                if node.key == "block_stop":
                    ctx.stopped.append(node.id)
        return THEN, decision.merged(acted)

    def run_workflow(self, node: Node, ctx: Context, passed: list) -> Decision:
        """The workflow the step names by its title, run in place as part of this event from its trigger on; one already running in this call is refused, so no call loops."""
        title = node.text.strip()
        called = next((c for c in self.charts.all() if c.title == title), None)
        if called is None or called.id in ctx.calling:
            self.failed(node, ctx, RuntimeError(f"no workflow is titled {title}" if called is None else f"{title} is already running in this call"))
            return Decision()
        ctx.calling.append(called.id)
        graph, decision = self.charts.graph(called), Decision()
        for start in [n for starts in graph.triggers.values() for n in starts]:
            decision = decision.merged(self.follow(graph.nodes[start], graph.nodes, graph.after, ctx, passed))
        ctx.calling.pop()
        return decision

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
        return self.states.resumed(ctx.state) if isinstance(ctx.state, Paused) else None

    def failed(self, node: Node, ctx: Context, fault: Exception) -> None:
        """A node that raised is recorded where the page can show it, and the path goes on past it, by no from a check and by then from an action, so one broken step never silences what follows. The ruling behind the catch is in NOTES, under the chart."""
        failure = WalkFailure(session=ctx.session, workflow=self.charts.chart_of(node).id, node=node.id, key=node.key, fault=f"{type(fault).__name__}: {fault}")
        self.entries.save(Entry(environment_id=ctx.environment_id, kind=FAILED, actor=Actor.system(), data=failure.to_data()), Actor.system())

    @staticmethod
    def trigger_key(event: Event) -> str:
        return event.key
