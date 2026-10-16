from journal.engine.states_catalogue import StatesCatalogue
from journal.features.chart.catalogue import Catalogue
from journal.features.chart.seeds.drawing import Drawing
from journal.features.chart.validation import HOLDS
from journal.features.registry import Registry
from journal.features.seed import Seed
from journal.models.actor import Actor
from journal.models.chart import Chart
from journal.models.count import Count
from journal.models.node import Node
from journal.models.node_kind import NodeKind
from journal.models.title import LONGEST
from journal.repositories.agents import Agents
from journal.repositories.counts import Counts
from journal.repositories.charts import NO, THEN, YES, Charts
from journal.repositories.settings import Settings

SHIPPED_STATES = ("idle", "working", "following_plan", "awaiting", "waiting", "expecting", "stuck", "running_sequence")
"""The states the journal ships workflows for."""
PLACE_ORDER = ("expecting", "stuck", "awaiting", "waiting", "running_sequence", "idle", "working", "following_plan")
"""The place the shipped workflows of one event take, the waits first: a wait released at an event hands the event on to the workflows that come after it in the order."""
SHARED_EVENTS = ("idle", "session_started", "prompt_submitted", "tool_finished", "messages.created", "messages.updated")
"""The events with conduct for every state, shipped as an Always workflow each: the inbox named at a stop, a start and a prompt, a message that comes named and the counts it starts, and a message read starting the count it is owed on."""
GUARDS = {"tool_starting": "Guards at Tool about to run"}
"""The journal's guards, one locked workflow per event bound to no state, first in the event's list in every journal: at a tool use, the inbox named and the write held while a message waits, and the answer owed held."""
HEAD = -1000
"""Where a locked workflow is placed: before anything the user orders."""
ALWAYS_PLACE = -500
"""Where an Always workflow is placed when drawn: after the locked ones, before the states' and the user's, until the user drags it."""
EVENT_ORDER = ("idle", "session_started", "prompt_submitted", "tool_starting", "tool_finished", "ticked", "messages.created", "messages.updated", "tasks.updated", "task_logs.created", "workers.updated", "questions.updated")
"""The order a state's workflows are made and listed in: the stop first, so the first workflow of all is Idle at Agent stops."""
KEPT = " (kept from the older shape)"
DRAWINGS_VERSION = 8
"""Raised when a shipped drawing changes, so an unedited shipped workflow is redrawn at the next boot."""
DRAWINGS_VERSION_KEY = "chart.drawings_version"
RETIRED_DRAWINGS_KEY = "chart.retired_drawings"
RETIRED_STATES = {"orienting": "its state is the look owed now", "at_mark": "its state is the mark owed now", "loading_skill": "its state is the skill owed now"}
"""The pause states that became facts: a user's workflow bound to one is kept, turned off, its title saying what became of its state."""
RETIRED_CHECKS = {"tool_uses_since_unread_every": ("count_every", "uses"), "tool_uses_since_unread_over": ("count_over", "uses"), "tool_uses_since_read_over": ("count_over", "owed"), "unread_reminders_over": ("count_over", "namings"), "edits_since_log_over": ("count_over", "edits"), "edits_since_log_every": ("count_every", "edits"), "edits_since_log_at": ("count_at", "edits")}
"""The counter checks that read the engine's hidden counts, each now a count check on the count the workflows keep: a user's workflow naming one is rewritten at boot."""
"""The shipped drawings taken out of a journal on purpose, by name, so a boot does not draw them again; Reset by their state and event brings one back."""
"""What a retired per-event workflow with the user's edits is called: its triggers gone, its edits kept to be drawn into a state's workflow."""

NEW_MESSAGE = "[messages.new] new message {{row}}"
ONE_UNREAD = "[messages.new] new message {{unread_numbers}}"
SOME_UNREAD = "[messages.some] new messages {{unread_numbers}}"
MANY_UNREAD = "[messages.many] {{unread_count}} messages unread: journal message unread"
STOPPED_OWING = "[chart.awaiting] you stopped while the journal awaits {{awaiting}}. do that first, or journal stuck \"<why>\" if you are truly stuck"
MARK_HELD = "[memory.held] writes wait until you decide what survives the context. journal fact create, journal rule create, or journal nothing \"<why>\""
ORIENT_HELD = "[briefing.orient] read what is in flight here before any other write: journal environment here"
SKILL_HELD = "[skills.required] read the {{skill_owed}} skill before anything else: {{skill_path}}. writes wait until you have"
UNREAD_HELD = "[messages.unread_held] your inbox is unread: {{unread_count}} waiting. journal message unread before any other write"
ANSWER = "[messages.answer] answer message {{owed}} before you do anything else. a reply with [!reply:N]; a face answers only a message of a few words"
ANSWER_HELD = "[messages.answer_held] your tool calls are held: answer message {{owed}} first. a reply with [!reply:N] in words; a face answers only a message of a few words; only a journal command and a look at the message's own files go through"
PARKED = "[tasks.parked] parked tasks, still open: {{parked_tasks}}. journal task resume <n> picks one up; leave them parked only on purpose"
CHECKPOINT = "[plans.checkpoint] plan {{plan_n}}: phase {{checkpoint_phase}} is complete and a checkpoint. the user looks before the next phase; wait for their word, then journal plan start {{plan_n}}"
CHECKPOINT_PASSED = "[plans.checkpoint_passed] plan {{plan_n}}: phase {{checkpoint_phase}} is complete, and in auto mode its checkpoint is no stop. journal plan start {{plan_n}} begins the next phase; carry on"
NEXT = "[tasks.next] tasks are open, and auto mode is on: task {{next_task}} next: {{next_task_title}}. sure you want to stop? carry on with it, or journal stuck \"<why>\" if you are truly stuck"
PARKED_STILL = "[tasks.parked_still] task {{parked_n}}, {{parked_title}}, is still parked: can you continue it now?. it was parked because: {{parked_why}}. journal task resume {{parked_n}} picks it up again"
CHECK_IN = "[tasks.check_in] nothing has happened for half an hour: is there anything left for you to do?. carry on, take the next task, or say so in one line"
LOG_OVERDUE = "[tasks.log_overdue] {{task_edits}} edits since you logged {{task}}. {{log_command}} \"<what was decided or done, and why>\" before any other write"
LOG_SOON = "[tasks.log_soon] {{task_edits}} edits since you logged {{task}}: say where it stands. {{log_command}} \"<where it stands>\""
IN_HAND = "[tasks.in_hand] {{task}} in hand, {{task_edits}} edits. if this is not what you are doing, finish it or park it and start the work you are on"
CARRY_ON = "[tasks.carry_on] {{task}} is in hand, {{logged}}: carry on. journal stuck \"<why>\" if you are truly stuck"
CARRY_ON_LOG = "[tasks.carry_on_log] {{task}} is in hand, {{logged}}: carry on. log where it stands first, then continue; journal stuck \"<why>\" if you are truly stuck"
STILL_OPEN = "[tasks.open] {{task}} is still open: log where it stands or finish it"
REPORTED = "[workers.reported] worker {{worker_n}}, {{worker_name}}, reported in the chat"
STOPPED = "[workers.stopped] worker {{worker_n}}, {{worker_name}}, stopped before it reported"
RETURNED = "[workers.returned] what you waited on came back: carry on"
ANSWERED = "question {{question_n}} is answered. journal question show {{question_n}} reads it whole, with the messages linked to it; act on the answer"
CHECK_AWAITED = "[tasks.check_awaited] check {{awaited}} now: you have waited {{quiet_minutes}} min. look at it. Still going: journal await again. Done or failed: log what came of it and take the next step"
STEP = "[sequences.step] sequence {{sequence_n}}, step {{sequence_step}}: {{sequence_step_text}}. journal sequence next when it is done"
class ShippedChart(Seed):
    """The workflows the journal ships: the conduct for every state as an Always workflow per shared event and the guards as a locked one, then one per state per trigger it has steps of its own at: made at boot where absent, redrawn when unedited and the shipped drawing is newer, and left alone when the user edited it. Workflows of the older shapes, bound to one event with no state or to a state with no event, retire at boot."""

    def __init__(self, charts: Charts, catalogue: Catalogue, settings: Settings, states: StatesCatalogue, agents: Agents, counts: Counts, registry: Registry) -> None:
        self.states, self.agents, self.counts, self.registry = states, agents, counts, registry
        self.charts, self.catalogue, self.settings = charts, catalogue, settings
        own = {
            ("idle", "idle"): self.idle_at_stop,
            ("idle", "ticked"): self.idle_at_tick,
            ("working", "tool_starting"): self.working_at_tool,
            ("working", "tasks.updated"): self.working_at_task_start,
            ("working", "task_logs.created"): self.working_at_log,
            ("working", "idle"): self.working_carries_on,
            ("working", "session_started"): self.skill_then(self.working_carries_on),
            ("following_plan", "idle"): self.following_at_stop,
            ("following_plan", "session_started"): self.skill_then(self.following_at_stop),
            ("working", "ticked"): self.working_at_tick,
            ("awaiting", "workers.updated"): self.awaiting_at_worker,
            ("waiting", "questions.updated"): self.waiting_at_question,
            ("expecting", "ticked"): self.expecting_at_tick,
            ("expecting", "tool_starting"): self.working_again,
            ("stuck", "tool_starting"): self.working_again,
            ("running_sequence", "idle"): self.sequence_at_stop,
        }
        for state in SHIPPED_STATES:
            if self.registry.skill_required_in(state) and (state, "session_started") not in own:
                own[(state, "session_started")] = self.state_skill
        shared = {"session_started": self.mark_then(self.journal_skill_then(self.shared_inbox)), "prompt_submitted": self.mark_then(self.prompt_skill_then(self.shared_inbox)), "idle": self.owed_stop_then(self.mark_then(self.shared_inbox)), "tool_finished": self.mark_then(None), "messages.created": self.shared_at_message, "messages.updated": self.shared_at_message_read}
        self.drawings: dict[str, Drawing] = {}
        for state in SHIPPED_STATES:
            for event in sorted({e for st, e in own if st == state}, key=EVENT_ORDER.index):
                self.drawings[self.key_of(state, event)] = Drawing(self.title_of(state, event), self.composed(own[(state, event)], None))
        for event in SHARED_EVENTS:
            self.drawings[self.key_of("", event)] = Drawing(f"Always at {self.catalogue.entry(NodeKind.TRIGGER, event).title}", self.composed(None, shared[event]))
        self.drawings[self.key_of("", "tool_starting")] = Drawing(GUARDS["tool_starting"], self.composed(None, self.mark_then(self.shared_at_tool)), locked=True)
        """One drawing per state per trigger it has steps of its own at, named state:event; then the conduct for every state as an Always workflow per shared event and the journal's guards, named :event, bound to no state."""

    def title_of(self, state: str, event: str) -> str:
        return f"{self.states.title_of(state)} at {self.catalogue.entry(NodeKind.TRIGGER, event).title}"

    def composed(self, own, shared):
        """One path from the trigger: the state's own steps first, then the shared conduct of the event, joined at every open end."""
        trigger = self.trigger

        def draw(chart: Chart) -> None:
            ends = [(trigger(chart), THEN)]
            if own:
                ends = own(chart, ends)
            if shared:
                shared(chart, ends)
        return draw

    def run(self) -> None:
        by = Actor.system()
        self.retire_the_older_shape(by)
        self.retire_unpaired(by)
        self.rewrite_retired_checks(by)
        self.retire_workflows_of_states_gone(by)
        self.stop_what_names_an_unknown_entry(by)
        self.carry_working_edits(by)
        self.name_the_shipped(by)
        retired = self.retired()
        for key, drawing in self.drawings.items():
            standing = self.shipped_named(key)
            if standing is None:
                if drawing.locked or key not in retired:
                    self.draw(key, by)
            elif self.outdated(standing):
                self.reset(standing, by)
        self.release_what_no_drawing_names(by)
        self.strip_the_shared_conduct(by)
        self.settings.set(DRAWINGS_VERSION_KEY, DRAWINGS_VERSION, by)

    def release_what_no_drawing_names(self, by: Actor) -> None:
        """A shipped workflow whose drawing the journal no longer ships, a state's at an event it has nothing of its own at: gone when unedited, else the user's own, its shared conduct stripped, still bound where it was."""
        for chart in [c for c in self.charts.shipped() if c.drawing and c.drawing not in self.drawings]:
            if all(n.shipped for n in self.charts.nodes_of(chart)):
                self.charts.remove(chart, by)
                continue
            self.strip(chart, by)
            self.charts.save(chart.with_(shipped=False, drawing="", title=chart.title + KEPT), by)

    def strip_the_shared_conduct(self, by: Actor) -> None:
        """An edited state's workflow drawn when it still carried the event's shared conduct loses those shipped nodes, now an Always workflow's, and keeps the user's own and the state's."""
        for chart in [c for c in self.charts.shipped() if c.state and c.drawn_version < DRAWINGS_VERSION]:
            self.strip(chart, by)

    def strip(self, chart: Chart, by: Actor) -> None:
        """The shipped nodes of the chart that the event's stateless workflows carry, by kind, key and words, taken out with their lines."""
        carried = {(n.kind, n.key, n.text) for c in self.charts.for_event(chart.event) if not c.state for n in self.charts.nodes_of(c) if n.kind != NodeKind.TRIGGER}
        for node in [n for n in self.charts.nodes_of(chart) if n.shipped and (n.kind, n.key, n.text) in carried]:
            self.charts.remove_node(node, by)

    @staticmethod
    def key_of(state: str, event: str) -> str:
        return f"{state}:{event}"

    def name_the_shipped(self, by: Actor) -> None:
        """A shipped workflow from before drawings had names is named after its state and event, once."""
        for chart in [c for c in self.charts.shipped() if not c.drawing and c.state and c.event]:
            self.charts.save(chart.with_(drawing=self.key_of(chart.state, chart.event)), by)

    def shipped_named(self, key: str) -> Chart | None:
        return next((c for c in self.charts.shipped() if c.drawing == key), None)

    def draw(self, key: str, by: Actor) -> Chart:
        """A shipped drawing drawn anew as its own workflow, named after it; a locked one at the head of its event's list, the rest in the states' order."""
        state, event = key.split(":", 1)
        drawing = self.drawings[key]
        place = self.stateless_place(event, drawing.locked) if not state else self.state_place(state)
        chart = self.charts.save(Chart(title=drawing.title, shipped=True, locked=drawing.locked, state=state, event=event, drawing=key, drawn_version=DRAWINGS_VERSION, place=place), by)
        drawing.draw(chart)
        return chart

    def stateless_place(self, event: str, locked: bool) -> int:
        """A locked workflow at the head, an Always one after the locked ones: each before the states' and the user's, in the order drawn."""
        standing = [c for c in self.charts.for_event(event) if not c.state and c.locked == locked]
        return (HEAD if locked else ALWAYS_PLACE) + len(standing)

    @staticmethod
    def state_place(state: str) -> int:
        """The place a state's shipped workflow takes at its event: the waits first, so a released wait hands the event on."""
        return PLACE_ORDER.index(state) if state in PLACE_ORDER else len(PLACE_ORDER)

    def retired(self) -> set[str]:
        return set(self.settings.project(RETIRED_DRAWINGS_KEY, []) or [])

    def forget(self, chart: Chart, by: Actor) -> None:
        """A shipped workflow taken out on purpose stays out: its drawing's name is remembered as retired and it is removed."""
        self.settings.set(RETIRED_DRAWINGS_KEY, sorted(self.retired() | {chart.drawing}), by)
        self.charts.remove(chart, by)

    def restore(self, key: str, by: Actor) -> Chart:
        """A retired shipped drawing drawn again, on the user's word."""
        self.settings.set(RETIRED_DRAWINGS_KEY, sorted(self.retired() - {key}), by)
        return self.draw(key, by)

    def outdated(self, chart: Chart) -> bool:
        """An unedited shipped workflow drawn by an older shipping is redrawn; one the user edited is theirs and stays, and the page says the shipping moved past it."""
        return int(self.settings.project(DRAWINGS_VERSION_KEY, 0) or 0) < DRAWINGS_VERSION and all(n.shipped for n in self.charts.nodes_of(chart))

    def behind(self, chart: Chart) -> bool:
        """A shipped workflow the user edited whose shipping has since moved on: kept as theirs, and told so on the page."""
        return chart.shipped and chart.drawn_version < DRAWINGS_VERSION and not all(n.shipped for n in self.charts.nodes_of(chart))

    def retire_unpaired(self, by: Actor) -> None:
        """A workflow bound to a state but no event, the shape before one per state per trigger, goes: whole when unedited, else kept as the user's own without its triggers."""
        for chart in [c for c in self.charts.all() if c.state and not c.event]:
            self.retire(chart, by)

    def retire_the_older_shape(self, by: Actor) -> None:
        """A shipped workflow bound to one event and no state and named after no drawing, the oldest shape, goes the same way; a shipped stateless one with a drawing's name is the journal's own."""
        for chart in [c for c in self.charts.shipped() if not c.state and not c.drawing]:
            self.retire(chart, by)

    def retire(self, chart: Chart, by: Actor) -> None:
        nodes = self.charts.nodes_of(chart)
        if all(node.shipped for node in nodes):
            self.charts.remove(chart, by)
            return
        for node in [n for n in nodes if n.kind == NodeKind.TRIGGER]:
            self.charts.remove_node(node, by)
        self.charts.save(chart.with_(shipped=False, state="", event="", title=chart.title + KEPT), by)

    def rewrite_retired_checks(self, by: Actor) -> None:
        """A user's workflow naming a counter check that read a hidden count is rewritten to the count check on the count the workflows keep, its number kept, and its title says what was rewritten."""
        for chart in [c for c in self.charts.all() if not c.shipped]:
            rewritten = []
            for node in [n for n in self.charts.nodes_of(chart) if n.kind == NodeKind.CHECK and n.key in RETIRED_CHECKS]:
                key, name = RETIRED_CHECKS[node.key]
                self.charts.nodes.save(node.with_(key=key, text=f"{name} {node.text}".strip()), by)
                rewritten.append(node.key)
            if rewritten:
                self.charts.save(chart.with_(title=f"{chart.title} (upgrade rewrote {', '.join(rewritten)} to count checks)"), by)
                self.charts.revised(chart, by)

    def retire_workflows_of_states_gone(self, by: Actor) -> None:
        """A user's workflow bound to a state that became a fact is kept, turned off, and its title says what became of its state."""
        for chart in [c for c in self.charts.all() if not c.shipped and c.state in RETIRED_STATES]:
            for trigger in [n for n in self.charts.nodes_of(chart) if n.kind == NodeKind.TRIGGER]:
                self.charts.remove_node(trigger, by)
            note = f" (turned off, {RETIRED_STATES[chart.state]})"
            self.charts.save(chart.with_(state="", title=chart.title[:LONGEST - len(note)] + note), by)
            self.charts.revised(chart, by)

    def carry_working_edits(self, by: Actor) -> None:
        """A Working agent's edits since its log, counted by the engine before the workflows counted them, become its edits count once, where none stands yet."""
        for agent in [a for a in self.agents.all() if a.state == "working" and a.data.get("edits")]:
            if not self.counts.where(environment_id=agent.environment_id, session=agent.session, name="edits"):
                self.counts.save(Count(environment_id=agent.environment_id, session=agent.session, name="edits", value=int(agent.data["edits"])), by)

    def stop_what_names_an_unknown_entry(self, by: Actor) -> None:
        """A kept or user workflow naming a check, action or trigger the catalogue no longer has is stopped at boot, its triggers taken out and its title saying why, rather than left to fail on every walk."""
        for chart in [c for c in self.charts.all() if not c.shipped]:
            nodes = self.charts.nodes_of(chart)
            unknown = next((n for n in nodes if not self.catalogue.has(n.kind, n.key)), None)
            triggers = [n for n in nodes if n.kind == NodeKind.TRIGGER]
            if unknown is None or not triggers:
                continue
            for trigger in triggers:
                self.charts.remove_node(trigger, by)
            self.charts.save(chart.with_(title=f"{chart.title} (stopped, {unknown.kind.value} {unknown.key} is no longer in the catalogue)"), by)

    def reset(self, chart: Chart, by: Actor) -> Chart:
        """A shipped workflow as shipped again: every node and line gone, its drawing drawn anew at the place its state ships at, one more revision."""
        drawing = self.drawings[chart.drawing or self.key_of(chart.state, chart.event)]
        for node in self.charts.nodes_of(chart):
            self.charts.remove_node(node, by)
        drawing.draw(chart)
        place = self.state_place(chart.state) if chart.state else chart.place
        return self.charts.save(chart.saved_again().with_(title=drawing.title, drawing=chart.drawing or self.key_of(chart.state, chart.event), drawn_version=DRAWINGS_VERSION, place=place), by)

    def node(self, chart: Chart, kind: NodeKind, key: str, text: str = "", x: int = 0, y: int = 0, locked: bool | None = None) -> Node:
        """A shipped node; a hold is a guard of the journal's protocol and is drawn locked, as is any node the drawing says so of."""
        return self.charts.add_node(chart, Node(kind=kind, key=key, text=text, x=x, y=y, shipped=True, locked=key in HOLDS if locked is None else locked), Actor.system())

    def trigger(self, chart: Chart) -> Node:
        """The workflow's one trigger, the event it is for, made where it is not yet."""
        standing = next((n for n in self.charts.nodes_of(chart) if n.kind == NodeKind.TRIGGER), None)
        return standing or self.node(chart, NodeKind.TRIGGER, chart.event, x=400, y=0)

    def line(self, source: Node, target: Node, port: str) -> None:
        self.charts.connect(source, target, port, Actor.system())

    def chain(self, ends: list, target: Node) -> None:
        """Every open end given leads on to the node: a check's unused answer, an action's then, so one path runs through every part in order."""
        for source, port in ends:
            self.line(source, target, port)

    def mark_then(self, shared):
        """Every agent event first: the context crossing a mark not taken holds the agent at it, locked, before the event's own conduct."""
        def draw(chart: Chart, ends: list) -> list:
            crossed = self.node(chart, NodeKind.CHECK, "context_over_mark", x=720, y=20, locked=True)
            held = self.node(chart, NodeKind.ACTION, "hold_at_mark", x=560, y=20, locked=True)
            self.chain(ends, crossed)
            self.line(crossed, held, YES)
            return shared(chart, [(crossed, NO), (held, THEN)]) if shared else [(crossed, NO), (held, THEN)]
        return draw

    def owed_stop_then(self, shared):
        """A stop while the agent owes the journal something is held, locked, naming what it awaits, before the stop's own conduct; a mark crossed at this very stop is not yet a debt here, so the decide line stands alone."""
        def draw(chart: Chart, ends: list) -> list:
            owed = self.node(chart, NodeKind.CHECK, "something_owed", x=720, y=112, locked=True)
            held = self.node(chart, NodeKind.ACTION, "block_stop", STOPPED_OWING, x=560, y=112, locked=True)
            self.chain(ends, owed)
            self.line(owed, held, YES)
            return shared(chart, [(owed, NO), (held, THEN)])
        return draw

    def state_skill(self, chart: Chart, ends: list) -> list:
        """A session starting in this state: the state's own skill is owed, where its feature says so."""
        owed = self.node(chart, NodeKind.ACTION, "require_skill", x=160, y=92)
        self.chain(ends, owed)
        return [(owed, THEN)]

    def skill_then(self, own):
        """The state's own steps at a start, after its skill is required."""
        return lambda chart, ends: own(chart, self.state_skill(chart, ends))

    def journal_skill_then(self, shared):
        """Every start owes the journal skill, locked, before the shared conduct, and ends owing the look at what is in flight here, locked."""
        def draw(chart: Chart, ends: list) -> list:
            owed = self.node(chart, NodeKind.ACTION, "require_skill", "journal", x=720, y=92, locked=True)
            self.chain(ends, owed)
            unoriented = self.node(chart, NodeKind.ACTION, "mark_unoriented", x=720, y=644, locked=True)
            self.chain(shared(chart, [(owed, THEN)]), unoriented)
            return [(unoriented, THEN)]
        return draw

    def prompt_skill_then(self, shared):
        """A prompt naming a skill's keyword owes that skill, locked, before the shared conduct."""
        def draw(chart: Chart, ends: list) -> list:
            names = self.node(chart, NodeKind.CHECK, "prompt_names_skill", x=720, y=92, locked=True)
            owed = self.node(chart, NodeKind.ACTION, "require_skill", x=720, y=184, locked=True)
            self.chain(ends, names)
            self.line(names, owed, YES)
            return shared(chart, [(names, NO), (owed, THEN)])
        return draw

    def shared_at_message(self, chart: Chart, ends: list) -> list:
        """A message the user leaves is named by number, typed into the terminal, and the counts of tool uses and inbox namings since it came start at nought."""
        by_user = self.node(chart, NodeKind.CHECK, "message_by_user", x=400, y=92)
        named = self.node(chart, NodeKind.ACTION, "type", NEW_MESSAGE, x=400, y=184)
        uses = self.node(chart, NodeKind.ACTION, "count_start", "uses", x=400, y=276)
        namings = self.node(chart, NodeKind.ACTION, "count_start", "namings", x=400, y=368)
        self.chain(ends, by_user)
        self.line(by_user, named, YES)
        self.line(named, uses, THEN)
        self.line(uses, namings, THEN)
        return [(by_user, NO), (namings, THEN)]

    def shared_at_message_read(self, chart: Chart, ends: list) -> list:
        """A message just read, the first owed: the count of tool uses since the agent owes an answer starts at nought."""
        read = self.node(chart, NodeKind.CHECK, "message_just_read", x=400, y=92)
        more = self.node(chart, NodeKind.CHECK, "unanswered_over", "2", x=400, y=184)
        owed = self.node(chart, NodeKind.ACTION, "count_start", "owed", x=400, y=276)
        self.chain(ends, read)
        self.line(read, more, YES)
        self.line(more, owed, NO)
        return [(read, NO), (more, YES), (owed, THEN)]

    def shared_inbox(self, chart: Chart, ends: list) -> list:
        """The inbox named at a start, a prompt and a stop."""
        return self.draw_inbox(chart, ends, x=720, y=92)

    def shared_at_tool(self, chart: Chart, ends: list) -> list:
        """At a tool use a skill owed holds a write until its file is read, as do the look at what is in flight still owed and a context mark not decided at, a read going through so each debt can be paid; then the counts of uses and uses owed go up by one; the unread inbox is named at every so many uses and the write held after so many namings, each naming counted; then a read message is answered before the next tool, held after so many uses owed, asked for after fewer."""
        left = 720
        skill = self.node(chart, NodeKind.CHECK, "skill_owed", x=left - 160, y=92, locked=True)
        writes_owing = self.node(chart, NodeKind.CHECK, "tool_writes", x=left - 160, y=184, locked=True)
        hold_skill = self.node(chart, NodeKind.ACTION, "hold", SKILL_HELD, x=left - 320, y=276)
        self.chain(ends, skill)
        self.line(skill, writes_owing, YES)
        self.line(writes_owing, hold_skill, YES)
        unoriented = self.node(chart, NodeKind.CHECK, "not_oriented", x=left - 160, y=368, locked=True)
        writes_unoriented = self.node(chart, NodeKind.CHECK, "tool_writes", x=left - 160, y=460, locked=True)
        hold_orient = self.node(chart, NodeKind.ACTION, "hold", ORIENT_HELD, x=left - 320, y=552)
        self.chain([(skill, NO), (writes_owing, NO), (hold_skill, THEN)], unoriented)
        self.line(unoriented, writes_unoriented, YES)
        self.line(writes_unoriented, hold_orient, YES)
        owed_mark = self.node(chart, NodeKind.CHECK, "mark_owed", x=left - 160, y=644, locked=True)
        writes_at_mark = self.node(chart, NodeKind.CHECK, "tool_writes", x=left - 160, y=736, locked=True)
        hold_mark = self.node(chart, NodeKind.ACTION, "hold", MARK_HELD, x=left - 320, y=828)
        self.chain([(unoriented, NO), (writes_unoriented, NO), (hold_orient, THEN)], owed_mark)
        self.line(owed_mark, writes_at_mark, YES)
        self.line(writes_at_mark, hold_mark, YES)
        ends = [(owed_mark, NO), (writes_at_mark, NO), (hold_mark, THEN)]
        use = self.node(chart, NodeKind.ACTION, "count_one", "uses", x=left + 80, y=92)
        owe = self.node(chart, NodeKind.ACTION, "count_one", "owed", x=left + 80, y=184)
        unread = self.node(chart, NodeKind.CHECK, "unread_messages", x=left + 80, y=276)
        reminders = self.node(chart, NodeKind.CHECK, "count_over", "namings messages.hold_after_reminders", x=left + 80, y=368)
        writes = self.node(chart, NodeKind.CHECK, "tool_writes", x=left, y=460)
        hold_unread = self.node(chart, NodeKind.ACTION, "hold", UNREAD_HELD, x=left, y=552)
        every = self.node(chart, NodeKind.CHECK, "count_every", "uses messages.remind_every", x=left + 160, y=552)
        self.chain(ends, use)
        self.line(use, owe, THEN)
        self.line(owe, unread, THEN)
        self.line(unread, reminders, YES)
        self.line(reminders, writes, YES)
        self.line(writes, hold_unread, YES)
        self.line(writes, every, NO)
        self.line(reminders, every, NO)
        named = self.draw_inbox(chart, [(every, YES)], x=left + 160, y=644)
        naming = self.node(chart, NodeKind.ACTION, "count_one", "namings", x=left + 160, y=1012)
        self.chain([end for end in named if end[0].key != "unread_messages"], naming)
        owed = self.node(chart, NodeKind.CHECK, "unanswered_messages", x=left + 400, y=92)
        journal = self.node(chart, NodeKind.CHECK, "journal_command", x=left + 400, y=184)
        theirs = self.node(chart, NodeKind.CHECK, "tool_reads_their_files", x=left + 400, y=276)
        held_after = self.node(chart, NodeKind.CHECK, "count_over", "owed messages.hold_after", x=left + 400, y=368)
        hold_owed = self.node(chart, NodeKind.ACTION, "hold", ANSWER_HELD, x=left + 320, y=460)
        ask_after = self.node(chart, NodeKind.CHECK, "count_over", "owed messages.nudge_after", x=left + 480, y=460)
        say_owed = self.node(chart, NodeKind.ACTION, "say", ANSWER, x=left + 480, y=552)
        self.chain([(unread, NO), (hold_unread, THEN), (every, NO), *[end for end in named if end[0].key == "unread_messages"], (naming, THEN)], owed)
        self.line(owed, journal, YES)
        self.line(journal, theirs, NO)
        self.line(theirs, held_after, NO)
        self.line(held_after, hold_owed, YES)
        self.line(held_after, ask_after, NO)
        self.line(ask_after, say_owed, YES)
        return [(owed, NO), (journal, YES), (theirs, YES), (hold_owed, THEN), (ask_after, NO), (say_owed, THEN)]

    def draw_inbox(self, chart: Chart, ends: list, x: int, y: int) -> list:
        """What waits unread, named after the ends given: one message by its number, a few by theirs, more than three by their count."""
        unread = self.node(chart, NodeKind.CHECK, "unread_messages", x=x, y=y)
        many = self.node(chart, NodeKind.CHECK, "unread_over", "4", x=x, y=y + 92)
        say_many = self.node(chart, NodeKind.ACTION, "say", MANY_UNREAD, x=x - 160, y=y + 184)
        some = self.node(chart, NodeKind.CHECK, "unread_over", "2", x=x, y=y + 184)
        say_some = self.node(chart, NodeKind.ACTION, "say", SOME_UNREAD, x=x - 160, y=y + 276)
        say_one = self.node(chart, NodeKind.ACTION, "say", ONE_UNREAD, x=x, y=y + 276)
        self.chain(ends, unread)
        self.line(unread, many, YES)
        self.line(many, say_many, YES)
        self.line(many, some, NO)
        self.line(some, say_some, YES)
        self.line(some, say_one, NO)
        return [(unread, NO), (say_many, THEN), (say_some, THEN), (say_one, THEN)]

    def idle_at_stop(self, chart: Chart, ends: list) -> list:
        """An agent at rest stopping: parked tasks hold it in any mode and in auto mode the next open task holds it."""
        parked = self.node(chart, NodeKind.CHECK, "parked_tasks", x=160, y=92)
        say_parked = self.node(chart, NodeKind.ACTION, "block_stop", PARKED, x=0, y=184)
        auto = self.node(chart, NodeKind.CHECK, "auto_mode", x=160, y=276)
        open_ = self.node(chart, NodeKind.CHECK, "open_tasks", x=160, y=368)
        hold_stop = self.node(chart, NodeKind.ACTION, "block_stop", NEXT, x=160, y=460)
        self.chain(ends, parked)
        self.line(parked, say_parked, YES)
        self.line(parked, auto, NO)
        self.line(auto, open_, YES)
        self.line(open_, hold_stop, YES)
        return [(say_parked, THEN), (auto, NO), (open_, NO), (hold_stop, THEN)]

    def following_at_stop(self, chart: Chart, ends: list) -> list:
        """An agent following a plan, at a stop or a session start: at a checkpoint it waits for the user's look, or in auto mode holds the stop and carries on; with a task in hand it carries on as Working does."""
        checkpoint = self.node(chart, NodeKind.CHECK, "plan_at_checkpoint", x=240, y=92)
        auto_at_checkpoint = self.node(chart, NodeKind.CHECK, "auto_mode", x=80, y=184)
        passed = self.node(chart, NodeKind.ACTION, "block_stop", CHECKPOINT_PASSED, x=0, y=276)
        looks = self.node(chart, NodeKind.ACTION, "say", CHECKPOINT, x=160, y=276)
        self.chain(ends, checkpoint)
        self.line(checkpoint, auto_at_checkpoint, YES)
        self.line(auto_at_checkpoint, passed, YES)
        self.line(auto_at_checkpoint, looks, NO)
        return [(passed, THEN), (looks, THEN), *self.carry_on(chart, [(checkpoint, NO)], x=400, y=184)]

    def idle_at_tick(self, chart: Chart, ends: list) -> list:
        """As the clock ticks on an agent at rest: the parked ask after a minute, then the check-in after half an hour."""
        parked_tick = self.node(chart, NodeKind.CHECK, "parked_tasks", x=240, y=92)
        quiet_a_minute = self.node(chart, NodeKind.CHECK, "quiet_for_over", "60", x=240, y=184)
        ask_parked = self.node(chart, NodeKind.ACTION, "type", PARKED_STILL, x=240, y=276)
        auto_tick = self.node(chart, NodeKind.CHECK, "auto_mode", x=560, y=92)
        quiet_half_an_hour = self.node(chart, NodeKind.CHECK, "quiet_for_over", "1800", x=560, y=184)
        check_in = self.node(chart, NodeKind.ACTION, "type", CHECK_IN, x=560, y=276)
        self.chain(ends, parked_tick)
        self.line(parked_tick, quiet_a_minute, YES)
        self.line(quiet_a_minute, ask_parked, YES)
        self.chain([(parked_tick, NO), (quiet_a_minute, NO), (ask_parked, THEN)], auto_tick)
        self.line(auto_tick, quiet_half_an_hour, YES)
        self.line(quiet_half_an_hour, check_in, YES)
        return [(auto_tick, NO), (quiet_half_an_hour, NO), (check_in, THEN)]

    def working_at_tool(self, chart: Chart, ends: list) -> list:
        """A task in hand at a tool use that writes: the edits since the log are read before this write counts; the write is held when the log is overdue and a held write does not count, the log asked for at the first threshold, the task named every so many edits."""
        writes = self.node(chart, NodeKind.CHECK, "tool_writes", x=160, y=92)
        overdue = self.node(chart, NodeKind.CHECK, "count_over", "edits tasks.log_after", x=160, y=184)
        hold_log = self.node(chart, NodeKind.ACTION, "hold", LOG_OVERDUE, x=0, y=276)
        first = self.node(chart, NodeKind.CHECK, "count_at", "edits tasks.first_nudge_after", x=240, y=276)
        say_soon = self.node(chart, NodeKind.ACTION, "say", LOG_SOON, x=160, y=368)
        named = self.node(chart, NodeKind.CHECK, "count_every", "edits tasks.name_every", x=320, y=368)
        say_in_hand = self.node(chart, NodeKind.ACTION, "say", IN_HAND, x=320, y=460)
        edit = self.node(chart, NodeKind.ACTION, "count_one", "edits", x=160, y=552)
        self.chain(ends, writes)
        self.line(writes, overdue, YES)
        self.line(overdue, hold_log, YES)
        self.line(overdue, first, NO)
        self.line(first, say_soon, YES)
        self.line(first, named, NO)
        self.line(named, say_in_hand, YES)
        self.chain([(say_soon, THEN), (named, NO), (say_in_hand, THEN)], edit)
        return [(writes, NO), (hold_log, THEN), (edit, THEN)]

    def working_at_task_start(self, chart: Chart, ends: list) -> list:
        """A task this agent has just started: its edits since the log start at nought."""
        started = self.node(chart, NodeKind.CHECK, "task_just_started", x=400, y=92)
        edits = self.node(chart, NodeKind.ACTION, "count_start", "edits", x=400, y=184)
        self.chain(ends, started)
        self.line(started, edits, YES)
        return [(started, NO), (edits, THEN)]

    def working_at_log(self, chart: Chart, ends: list) -> list:
        """A log line for the task in hand: its edits since the log start at nought again."""
        mine = self.node(chart, NodeKind.CHECK, "log_for_task_in_hand", x=400, y=92)
        edits = self.node(chart, NodeKind.ACTION, "count_start", "edits", x=400, y=184)
        self.chain(ends, mine)
        self.line(mine, edits, YES)
        return [(mine, NO), (edits, THEN)]

    def working_carries_on(self, chart: Chart, ends: list) -> list:
        """A task in hand at a stop or a session start: carry on, with the log asked for when it is stale."""
        return self.carry_on(chart, ends, x=240, y=92)

    def carry_on(self, chart: Chart, ends: list, x: int, y: int) -> list:
        """The carry-on steps after the ends given: the log asked for when it is stale, else carry on."""
        stale = self.node(chart, NodeKind.CHECK, "log_stale_over", "600", x=x, y=y)
        carry_on_log = self.node(chart, NodeKind.ACTION, "say", CARRY_ON_LOG, x=x - 80, y=y + 92)
        carry_on = self.node(chart, NodeKind.ACTION, "say", CARRY_ON, x=x + 80, y=y + 92)
        self.chain(ends, stale)
        self.line(stale, carry_on_log, YES)
        self.line(stale, carry_on, NO)
        return [(carry_on_log, THEN), (carry_on, THEN)]

    def working_at_tick(self, chart: Chart, ends: list) -> list:
        """A task in hand as the clock ticks: still open after a quiet quarter hour."""
        quiet = self.node(chart, NodeKind.CHECK, "quiet_for_over", "900", x=400, y=92)
        still_open = self.node(chart, NodeKind.ACTION, "say", STILL_OPEN, x=400, y=184)
        self.chain(ends, quiet)
        self.line(quiet, still_open, YES)
        return [(quiet, NO), (still_open, THEN)]

    def awaiting_at_worker(self, chart: Chart, ends: list) -> list:
        """An agent awaiting workers: one reporting is told, then one stopping, and the agent goes back to its work when its last worker is back."""
        for column, came, told in ((240, "worker_reported", REPORTED), (560, "worker_stopped", STOPPED)):
            now = self.node(chart, NodeKind.CHECK, came, x=column, y=92)
            awaited = self.node(chart, NodeKind.CHECK, "agent_awaits_the_worker", x=column, y=184)
            tell = self.node(chart, NodeKind.ACTION, "type", told, x=column, y=276)
            last = self.node(chart, NodeKind.CHECK, "last_worker_back", x=column, y=368)
            back = self.node(chart, NodeKind.ACTION, "release", RETURNED, x=column, y=460)
            self.chain(ends, now)
            self.line(now, awaited, YES)
            self.line(awaited, tell, YES)
            self.line(tell, last, THEN)
            self.line(last, back, YES)
            ends = [(now, NO), (awaited, NO), (last, NO), (back, THEN)]
        return ends

    def waiting_at_question(self, chart: Chart, ends: list) -> list:
        """An agent waiting on a question: when it is answered the agent goes back to its work, told how to read the answer."""
        answered = self.node(chart, NodeKind.CHECK, "question_answered", x=400, y=92)
        waits = self.node(chart, NodeKind.CHECK, "agent_waits_on_the_question", x=400, y=184)
        back = self.node(chart, NodeKind.ACTION, "release", ANSWERED, x=400, y=276)
        self.chain(ends, answered)
        self.line(answered, waits, YES)
        self.line(waits, back, YES)
        return [(answered, NO), (waits, NO), (back, THEN)]

    def expecting_at_tick(self, chart: Chart, ends: list) -> list:
        """An agent awaiting something outside: after five quiet minutes it is told to check it, with what it awaits and how long."""
        quiet = self.node(chart, NodeKind.CHECK, "quiet_for_over", "300", x=400, y=92)
        check = self.node(chart, NodeKind.ACTION, "say", CHECK_AWAITED, x=400, y=184)
        self.chain(ends, quiet)
        self.line(quiet, check, YES)
        return [(quiet, NO), (check, THEN)]

    def working_again(self, chart: Chart, ends: list) -> list:
        """The agent's own tool use ends a wait on something outside: the wait is released, with no line."""
        own = self.node(chart, NodeKind.CHECK, "own_tool", x=160, y=92)
        back = self.node(chart, NodeKind.ACTION, "release", x=160, y=184)
        self.chain(ends, own)
        self.line(own, back, YES)
        return [(own, NO), (back, THEN)]

    def sequence_at_stop(self, chart: Chart, ends: list) -> list:
        """An agent working through a sequence: a stop is told the step in hand; stepping on is the state's move."""
        step = self.node(chart, NodeKind.ACTION, "say", STEP, x=400, y=92)
        self.chain(ends, step)
        return [(step, THEN)]
