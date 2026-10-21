import re
from journal.features.chart.support.renamed_nudges import RENAMED_NUDGES
from journal.support.states_catalogue import StatesCatalogue
from journal.features.chart.seeds.support.guard import Guard
from journal.support.chart_catalogue import FORMER_TITLES, ChartCatalogue
from journal.support.title import LONGEST
from journal.features.chart.seeds.support.drawing import Drawing
from journal.features.registry import Registry
from journal.features.seed import Seed
from journal.support.actor import Actor
from journal.models.chart import Chart
from journal.models.node import Node
from journal.models.node_kind import NodeKind
from journal.repositories.agents import Agents
from journal.features.chart.support.values_at_upgrade import ValuesAtUpgrade
from journal.features.chart.support.workflow_values import WorkflowValues
from journal.support.validation import Validation
from journal.support.drawn_node import DrawnNode
from journal.support.drawn_line import NO, THEN, YES
from journal.repositories.charts import Charts
from journal.repositories.setting_rows import SettingRows

SHIPPED_STATES = ("idle", "working", "following_plan", "awaiting", "waiting", "expecting", "stuck", "ended")
"""The states the journal ships workflows for."""
PLACE_ORDER = ("expecting", "stuck", "awaiting", "waiting", "idle", "following_plan", "working", "ended")
"""The place the shipped workflows of one event take, the waits first, and a child state before its parent, so following a plan speaks at a checkpoint before Working's lines and can end the walk there."""
SETTING = re.compile(r"\{([a-z_]+\.[a-z_]+)\}")
"""A setting a shipped title names, filled with its value when the title is drawn."""
STATELESS = (
    (":session_started:stale", "Ask whether facts, rules and reminders {memory.stale_after} days old still hold", "ask_about_old_memory"),
)
"""The Always workflows the journal ships, one subject each, in the order they run at their event: the drawing's name, its title and the builder that draws it."""
OWN = (
    ("waiting", "questions.updated", "question", "Send the agent back to its work when the question is answered", "waiting_at_question"),
    ("expecting", "ticked", "remind", "Remind the agent what it waits for after five minutes of quiet", "expecting_at_tick"),
    ("expecting", "ticked", "meanwhile", "Point to the next task once per wait, after a minute of it, in auto mode", "next_while_waiting"),
    ("expecting", "tool_starting", "back", "Send the agent back to its work when it uses a tool itself", "working_again"),
    ("stuck", "tool_starting", "back", "Send the agent back to its work when it uses a tool itself", "working_again"),
    ("awaiting", "tool_starting", "back", "Send the agent back to its work when it uses a tool itself", "working_again"),
    ("waiting", "tool_starting", "back", "Send the agent back to its work when it uses a tool itself", "working_again"),
    ("ended", "session_started", "nothing", "No workflow for this state yet", "nothing_own"),
)
"""The workflows the journal ships for a state, one concern each: the state, the event, the drawing's name, what it does in plain words, and the builder that draws it."""
ACTIVE = ("session_started", "prompt_submitted", "tool_starting", "idle")
"""The agent's own events that show it is not quiet: a start, a prompt, a tool use and a stop."""
HEAD = -1000
"""Where a locked workflow is placed: before anything the user orders; the journal ships none now, a user's own may be locked."""
ALWAYS_PLACE = -500
"""Where an Always workflow is placed when drawn: after the locked ones, before the states' and the user's, until the user drags it."""
EVENT_ORDER = ("idle", "session_started", "prompt_submitted", "tool_starting", "tool_finished", "ticked", "messages.created", "messages.updated", "tasks.updated", "task_logs.created", "workers.updated", "questions.updated")
"""The order a state's workflows are made and listed in: the stop first, so the first workflow of all is Idle at Agent stops."""
KEPT = " (kept from the older shape)"
DRAWINGS_VERSION = 30
"""Raised when a shipped drawing changes, so an unedited shipped workflow is redrawn at the next boot."""
DRAWINGS_VERSION_KEY = "chart.drawings_version"
RETIRED_DRAWINGS_KEY = "chart.retired_drawings"
RETIRED_STATES = {"orienting": "its state is the look owed now", "at_mark": "its state is the mark owed now", "loading_skill": "its state is the skill owed now"}
"""The pause states that became facts: a user's workflow bound to one is kept, turned off, its title saying what became of its state."""
RETIRED_MOVES = {"idle": ("go_idle", ""), "expecting": ("wait_outside", ""), "stuck": ("mark_stuck", "")}
"""The one move node of the older shape, Change the agent's state, by the state it named: each is an outcome-named action now, the words after the name kept as its text."""
RETIRED_CHECKS = {"tool_uses_since_unread_every": ("count_every", "uses"), "tool_uses_since_unread_over": ("count_over", "uses"), "tool_uses_since_read_over": ("count_over", "owed"), "unread_reminders_over": ("count_over", "namings"), "edits_since_log_over": ("count_over", "edits"), "edits_since_log_every": ("count_every", "edits"), "edits_since_log_at": ("count_at", "edits")}
"""The counter checks of an older shape, each now a count check on a count read from the journal's record: a user's workflow naming one is rewritten at boot."""
"""The shipped drawings taken out of a journal on purpose, by name, so a boot does not draw them again; Reset by their state and event brings one back."""
"""What a retired per-event workflow with the user's edits is called: its triggers gone, its edits kept to be drawn into a state's workflow."""

ONE_UNREAD = "[messages.new_message_to_answer] new message {{unread_numbers}}"
SOME_UNREAD = "[messages.new_messages_to_answer] new messages {{unread_numbers}}"
MANY_UNREAD = "[messages.unread_messages_to_read] {{unread_count}} messages unread: `journal message unread`"
VOICE = "[voices.how_to_talk_to_the_user] how to talk to the user. {{voice}}"
REMIND = "[etiquette.a_line_is_an_instruction] chat etiquette: a line from the journal is an instruction, not a message. act on it or note it, never answer or mention it in the chat; what the user needs to know still goes to the chat"
PLAN_NEXT = "[plans.next_task_of_the_plan] plan {{followed_plan}}: task {{plan_next_task}} is next. {{plan_next_briefing}}"
PLAN_WAITING = "[plans.plan_waits_on_its_tasks] plan {{followed_plan}}: no task can start now; {{plan_tasks_left}} parked, blocked or waiting. `journal task list` says what each waits on; when one can go on, `journal plan start {{followed_plan}}` takes it up"
CHECK_BACKGROUND = "[shell.check_the_background] output {{background_outputs}} still running. look at it; hung or stuck: stop it and say why"
REPORTS_WAITING = "[workers.act_on_the_reports] {{reports_waiting}} reported and you have not acted on it yet. read its report, then give it its next job (`journal worker say <n> \"<job>\"`), stop it, or `journal worker done <n>` once its work is merged or used"
VERSION_3 = "[migration.version_3_not_brought_across] a version 3 journal is kept whole in .journal/version-3, not yet brought across. the user brings it across from the viewer; never start it yourself"
STALE = "[memory.check_stale_memory] these are {{stale_after}} days old or more, check they still hold: {{stale}}. strike what no longer holds (`journal fact strike <n>`), reword what drifted, and keep the rest"
WHERE = "[briefing.brief_and_log_after_compaction] after the compaction, the work stands here: {{task}}, its last log {{last_log}}; uncommitted files: {{uncommitted}}. pick up from there, and log what the summary does not say"
UNREAD_HELD = "[messages.write_held_until_read] you have {{unread_count}} unread messages. `journal message unread` before any other write"
ANSWER = "[messages.answer_before_anything_else] answer or react to message {{owed}} before you do anything else"
ANSWER_HELD = "[messages.tools_held_until_answered] answer or react to message {{owed}} first. your tool calls wait until you do"
PARKED = "[tasks.parked_tasks_still_open] parked tasks, still open: {{parked_tasks}}. `journal task resume <n>` picks one up; leave them parked only on purpose"
BROKEN_WAIT = "[tasks.fix_the_broken_wait] {{broken_waits}}. so it would wait forever: fix the command with `journal task block <n> --until \"<command>\"`, or `journal task unblock <n>`"
BLOCKED_STILL = "[tasks.blocked_task_asked_about] blocked, with nothing that opens it by itself: {{blocked_without_wait}}. has what it waits on come? `journal task unblock <n>` when it has"
CHECKPOINT = "[plans.phase_complete_at_a_checkpoint] plan {{plan_n}}: phase {{checkpoint_phase}} is complete and a checkpoint. the user looks before the next phase; wait for their word, then `journal plan start {{plan_n}}`"
CHECKPOINT_PASSED = "[plans.phase_complete_go_on] plan {{plan_n}}: phase {{checkpoint_phase}} is complete, and in auto mode it does not stop you. `journal plan start {{plan_n}}` begins the next phase; carry on"
NEXT = "[tasks.next_task_holds_the_stop] tasks are open, and auto mode is on: task {{next_task}} next: {{next_task_title}}. sure you want to stop? carry on with it, or `journal stuck \"<why>\"` if you are truly stuck"
PARKED_AT_CLOSE = "[tasks.parked_task_named_at_close] task {{parked_n}} is still parked: can you continue it now? It was parked because: {{parked_why}}. `journal task resume {{parked_n}}` picks it up again"
PARKED_STILL = "[tasks.parked_task_asked_about] task {{parked_n}} is still parked: can you continue it now? It was parked because: {{parked_why}}. `journal task resume {{parked_n}}` picks it up again"
CHECK_IN = "[tasks.check_in_after_quiet] nothing has happened for half an hour: is there anything left for you to do? Carry on, take the next task, or say so in one line"
LOG_OVERDUE = "[tasks.write_held_until_logged] {{value.writes}} edits since you logged {{task}}. {{log_command}} \"<what was decided or done, and why>\" before any other write"
LOG_SOON = "[tasks.log_where_it_stands] {{value.writes}} edits since you logged {{task}}: say where it stands. {{log_command}} \"<where it stands>\""
IN_HAND = "[tasks.task_in_hand_repeated] {{task}} in hand, {{value.writes}} edits. if this is not what you are doing, finish it or park it and start the work you are on"
CARRY_ON = "[tasks.carry_on] {{task}} is in hand, {{logged}}: carry on. `journal stuck \"<why>\"` if you are truly stuck"
LOG_OLD = "[tasks.log_first_at_stop] {{task}}, {{logged.last_log}}: log where it stands first. {{log_command}} \"<where it stands>\""
STILL_OPEN = "[tasks.task_still_open] {{task}} is still open: log where it stands or finish it"
ANSWERED = "question {{question_n}} is answered. `journal question show {{question_n}}` reads it whole, with the messages linked to it; act on the answer"
APPROVED_UNSTARTED = "[plans.approved_unstarted] plan {{approved_plan}} is approved and not started: `journal plan start {{approved_plan}}` begins its first task"
MEANWHILE = "[tasks.meanwhile] while you wait for {{awaited}}, task {{related_task}} is next: if you can work on it meanwhile, carry on with it; if you need the output first, waiting is fine"
CHECK_AWAITED = "[tasks.check_what_you_awaited] check {{awaited}} now: you have waited {{minutes.waiting_since}} min. look at it. Still going: `journal await` again. Done or failed: log what came of it and take the next step"
class ShippedChart(Seed):
    """The workflows the journal ships: the conduct for every state as an Always workflow per shared event and the guards as a locked one, then one per state per trigger it has steps of its own at: made at boot where absent, redrawn when unedited and the shipped drawing is newer, and left alone when the user edited it. Workflows of the older shapes, bound to one event with no state or to a state with no event, retire at boot."""

    def __init__(self, charts: Charts, catalogue: ChartCatalogue, settings: SettingRows, states: StatesCatalogue, agents: Agents, values: WorkflowValues, registry: Registry, seeding: ValuesAtUpgrade) -> None:
        self.states, self.agents, self.values, self.registry, self.seeding = states, agents, values, registry, seeding
        self.charts, self.catalogue, self.settings = charts, catalogue, settings
        self.drawings: dict[str, Drawing] = {}
        self.templates: dict[str, str] = {}
        for state, event, name, title, builder in OWN:
            self.templates[f"{state}:{event}:{name}"] = title
            self.drawings[f"{state}:{event}:{name}"] = Drawing(self.titled(title), self.composed(getattr(self, builder), None))
        for key, title, builder in STATELESS:
            self.templates[key] = title
            self.drawings[key] = Drawing(self.titled(title), self.composed(None, getattr(self, builder)))
        """One drawing per state per trigger it has steps of its own at, named state:event; then the conduct for every state as an Always workflow per shared event and the journal's guards, named :event, bound to no state."""

    def title_of(self, key: str) -> str:
        return self.drawings[key].title

    def titled(self, template: str) -> str:
        """A title with each setting it names, {messages.remind_every}, filled with the setting's value now."""
        options = {o.key: o for o in self.registry.options()}
        return SETTING.sub(lambda m: str(self.settings.option(options[m.group(1)])) if m.group(1) in options else m.group(0), template)

    def numbered_alike(self, key: str, title: str) -> bool:
        """The title is the drawing's own with some numbers in its settings' places: the journal's title, never renamed by the user."""
        template = self.templates.get(key, "")
        pattern = r"\d+".join(re.escape(part) for part in SETTING.split(template)[::2])
        return bool(template) and re.fullmatch(pattern, title) is not None

    def old_title(self, chart: Chart) -> str:
        """The title a shipped workflow carried before titles said what a workflow does: its state, or Always or Guards, at its event."""
        event = self.catalogue.entry(NodeKind.TRIGGER, chart.event).title if self.catalogue.has(NodeKind.TRIGGER, chart.event) else chart.event
        whose = self.states.title_of(chart.state) if chart.state else "Always"
        return f"{whose} at {event}"

    def old_titles(self, chart: Chart) -> set[str]:
        """Every title a shipped workflow carried before its drawing said what it does, under the event's name now and the one it had before."""
        event = self.catalogue.entry(NodeKind.TRIGGER, chart.event).title if self.catalogue.has(NodeKind.TRIGGER, chart.event) else chart.event
        whose = self.states.title_of(chart.state) if chart.state else "Always"
        return {f"{who} at {name}" for who in (whose, "Guards") for name in (event, FORMER_TITLES.get(event, event))}

    def retitle_the_shipped(self, by: Actor) -> None:
        """A shipped workflow still titled by its state and event, or by its own title with older numbers, which the user never renamed, takes the title that says what it does with the settings' numbers now."""
        for chart in [c for c in self.charts.shipped() if c.drawing in self.drawings and c.title != self.drawings[c.drawing].title and (c.title in self.old_titles(c) or self.numbered_alike(c.drawing, c.title))]:
            self.charts.save(chart.with_(title=self.drawings[chart.drawing].title), by)

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
        drawn_before = int(self.settings.project(DRAWINGS_VERSION_KEY, 0))
        self.retire_the_older_shape(by)
        self.retire_unpaired(by)
        self.rewrite_retired_checks(by)
        self.rewrite_renamed_nudges(by)
        self.retire_workflows_of_states_gone(by)
        self.stop_what_names_an_unknown_entry(by)
        self.stop_what_reads_a_count_it_does_not_keep(by)
        self.name_the_shipped(by)
        self.retitle_the_shipped(by)
        retired = self.retired()
        for key, drawing in self.drawings.items():
            snapshot = self.shipped_named(key)
            if snapshot is None:
                if drawing.locked or key not in retired:
                    self.draw(key, by)
            elif self.outdated(snapshot):
                self.reset(snapshot, by)
        self.release_what_no_drawing_names(by)
        self.strip_the_shared_conduct(by)
        self.rewrite_retired_checks(by)
        self.stop_what_names_an_unknown_entry(by)
        self.seeding.seed(drawn_before, by)
        self.settings.set(DRAWINGS_VERSION_KEY, DRAWINGS_VERSION, by)

    def release_what_no_drawing_names(self, by: Actor) -> None:
        """A shipped workflow whose drawing the journal no longer ships, a state's at an event it has nothing of its own at: gone when unedited, else the user's own, its shared conduct stripped, still bound where it was."""
        for chart in [c for c in self.charts.shipped() if c.drawing and c.drawing not in self.drawings]:
            if all(n.shipped for n in self.charts.nodes_of(chart)):
                self.charts.remove(chart, by)
                continue
            self.strip(chart, by)
            self.strip_what_its_drawings_carry(chart, by)
            self.charts.save(chart.with_(shipped=False, locked=False, drawing="", title=self.noted_title(chart, KEPT)), by)

    def strip_what_its_drawings_carry(self, chart: Chart, by: Actor) -> None:
        """The shipped nodes of a released workflow that a current shipped workflow of its state and event carries, taken out, so no line is said twice."""
        carried = {(n.kind, n.key, n.text) for c in self.charts.for_event(chart.event) if c.shipped and c.state == chart.state and c.id != chart.id for n in self.charts.nodes_of(c) if n.kind != NodeKind.TRIGGER}
        self.remove_carried(chart, carried, by)

    def strip_the_shared_conduct(self, by: Actor) -> None:
        """An edited state's workflow drawn when it still carried the event's shared conduct loses those shipped nodes, now an Always workflow's, and keeps the user's own and the state's."""
        for chart in [c for c in self.charts.shipped() if c.state and c.drawn_version < DRAWINGS_VERSION]:
            self.strip(chart, by)

    def remove_carried(self, chart: Chart, carried: set, by: Actor) -> None:
        """The chart's shipped nodes another workflow carries, by kind, key and words, taken out with their lines."""
        for node in [n for n in self.charts.nodes_of(chart) if n.shipped and (n.kind, n.key, n.text) in carried]:
            self.charts.remove_node(node, by)

    def strip(self, chart: Chart, by: Actor) -> None:
        """The shipped nodes of the chart that the event's stateless workflows carry, by kind, key and words, taken out with their lines."""
        carried = {(n.kind, n.key, n.text) for c in self.charts.for_event(chart.event) if not c.state for n in self.charts.nodes_of(c) if n.kind != NodeKind.TRIGGER}
        self.remove_carried(chart, carried, by)

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
        state, event = key.split(":")[:2]
        drawing = self.drawings[key]
        place = self.shipped_place(key)
        chart = self.charts.save(Chart(title=drawing.title, shipped=True, locked=drawing.locked, state=state, event=event, drawing=key, drawn_version=DRAWINGS_VERSION, places={event: place}), by)
        drawing.draw(chart)
        return chart

    def shipped_place(self, key: str) -> int:
        """A shipped workflow's place at its event, from the table's order alone, so draw and reset agree: a locked one at the head, an Always one after the locked ones, each before the states'; a state's takes its state's place, times ten, plus its own among the state's drawings."""
        state, event = key.split(":")[:2]
        if not state:
            locked = self.drawings[key].locked
            siblings = [k for k, d in self.drawings.items() if k.startswith(f":{event}:") and d.locked == locked]
            return (HEAD if locked else ALWAYS_PLACE) + siblings.index(key)
        siblings = [k for k in self.drawings if k.startswith(f"{state}:{event}:")]
        return self.state_place(state) * 10 + (siblings.index(key) if key in siblings else 0)

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

    @staticmethod
    def noted_title(chart: Chart, note: str) -> str:
        """The workflow's title with a note of what boot did to it, the title cut so the whole stays within a title's length."""
        return chart.title[:LONGEST - len(note)].rstrip() + note

    def users(self) -> list[Chart]:
        """The workflows that are the user's: their own, and shipped ones they edited."""
        return [c for c in self.charts.all() if not c.shipped or not all(n.shipped for n in self.charts.nodes_of(c))]

    def outdated(self, chart: Chart) -> bool:
        """An unedited shipped workflow drawn by an older shipping is redrawn; one the user edited is theirs and stays, and the page says the shipping moved past it."""
        return int(self.settings.project(DRAWINGS_VERSION_KEY, 0)) < DRAWINGS_VERSION and all(n.shipped for n in self.charts.nodes_of(chart))

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
        self.charts.save(chart.with_(shipped=False, state="", event="", title=self.noted_title(chart, KEPT)), by)

    def rewrite_retired_checks(self, by: Actor) -> None:
        """A user's workflow naming a counter check that read a hidden count is rewritten to the count check on the count the workflows keep, its number kept, and one naming the older move is rewritten to the outcome-named action; its title says what was rewritten."""
        for chart in [c for c in self.charts.all() if not c.shipped]:
            rewritten = []
            for node in [n for n in self.charts.nodes_of(chart) if n.kind == NodeKind.CHECK and n.key in RETIRED_CHECKS]:
                key, name = RETIRED_CHECKS[node.key]
                self.charts.nodes.save(node.with_(key=key, text=f"{name} {node.text}".strip()), by)
                rewritten.append(node.key)
            for node in [n for n in self.charts.nodes_of(chart) if n.kind == NodeKind.ACTION and n.key == "move_to"]:
                state, _, words = node.text.strip().partition(" ")
                key, _ = RETIRED_MOVES.get(state, ("go_idle", ""))
                self.charts.nodes.save(node.with_(key=key, text=words.strip() if key != "go_idle" else ""), by)
                rewritten.append("move_to")
            if rewritten:
                self.charts.save(chart.with_(title=self.noted_title(chart, f" (upgrade rewrote {', '.join(rewritten)} to count checks)")), by)
                self.charts.revised(chart, by)

    def rewrite_renamed_nudges(self, by: Actor) -> None:
        for chart in self.charts.all():
            for node in [n for n in self.charts.nodes_of(chart) if any(f"[{old}]" in n.text for old in RENAMED_NUDGES)]:
                text = node.text
                for old, new in RENAMED_NUDGES.items():
                    text = text.replace(f"[{old}]", f"[{new}]")
                self.charts.nodes.save(node.with_(text=text), by)

    def retire_workflows_of_states_gone(self, by: Actor) -> None:
        """A user's workflow bound to a state that became a fact is kept, turned off, and its title says what became of its state."""
        for chart in [c for c in self.charts.all() if not c.shipped and c.state in RETIRED_STATES]:
            for trigger in [n for n in self.charts.nodes_of(chart) if n.kind == NodeKind.TRIGGER]:
                self.charts.remove_node(trigger, by)
            note = f" (turned off, {RETIRED_STATES[chart.state]})"
            self.charts.save(chart.with_(state="", title=self.noted_title(chart, note)), by)
            self.charts.revised(chart, by)

    def stop_what_names_an_unknown_entry(self, by: Actor) -> None:
        """A kept or user workflow, or a shipped one the user edited, naming a check, action or trigger the catalogue no longer has is stopped at boot, its triggers taken out and its title saying why, rather than left to fail on every walk."""
        for chart in self.users():
            nodes = self.charts.nodes_of(chart)
            unknown = next((n for n in nodes if not self.catalogue.has(n.kind, n.key)), None)
            triggers = [n for n in nodes if n.kind == NodeKind.TRIGGER]
            if unknown is None or not triggers:
                continue
            for trigger in triggers:
                self.charts.remove_node(trigger, by)
            self.charts.save(chart.with_(title=self.noted_title(chart, f" (stopped, {unknown.kind.value} {unknown.key} is no longer in the catalogue)")), by)

    def stop_what_reads_a_count_it_does_not_keep(self, by: Actor) -> None:
        """A user's workflow, or a shipped one the user edited, reading a count or a time none of its own nodes sets, as one could read another workflow's or a reading of the record before each kept its own, is stopped at boot, its triggers taken out and its title saying why."""
        for chart in self.users():
            nodes = self.charts.nodes_of(chart)
            foreign = Validation.value_faults([DrawnNode.of(n) for n in nodes])
            triggers = [n for n in nodes if n.kind == NodeKind.TRIGGER]
            if not foreign or not triggers:
                continue
            for trigger in triggers:
                self.charts.remove_node(trigger, by)
            name = next(n.text.strip().partition(" ")[0] for n in nodes if str(n.id) == foreign[0].node)
            why = f" (off, reads {name}, a value it does not keep)"
            self.charts.save(chart.with_(title=self.noted_title(chart, why)), by)

    def reset(self, chart: Chart, by: Actor) -> Chart:
        """A shipped workflow as shipped again: every node and line gone, its counts and times with them, its drawing drawn anew at the place it ships at, one more revision."""
        drawing = self.drawings[chart.drawing or self.key_of(chart.state, chart.event)]
        for node in self.charts.nodes_of(chart):
            self.charts.remove_node(node, by)
        self.values.forget(chart, by)
        drawing.draw(chart)
        place = self.shipped_place(chart.drawing) if chart.drawing in self.drawings else chart.place_at(chart.event)
        drawn = self.charts.find(chart.id)
        return self.charts.save(drawn.saved_again().placed(chart.event, place).with_(title=drawing.title, drawing=chart.drawing or self.key_of(chart.state, chart.event), drawn_version=DRAWINGS_VERSION), by)

    def node(self, chart: Chart, kind: NodeKind, key: str, text: str = "", x: int = 0, y: int = 0, locked: bool | None = None) -> Node:
        """A shipped node; a hold is a guard of the journal's protocol and is drawn locked, as is any node the drawing says so of."""
        return self.charts.add_node(chart, Node(kind=kind, key=key, text=text, x=x, y=y, shipped=True, locked=bool(locked)), Actor.system())

    def trigger(self, chart: Chart) -> Node:
        """The workflow's one trigger, the event it is for, made where it is not yet."""
        snapshot = next((n for n in self.charts.nodes_of(chart) if n.kind == NodeKind.TRIGGER), None)
        return snapshot or self.node(chart, NodeKind.TRIGGER, chart.event, x=400, y=0)

    def line(self, source: Node, target: Node, port: str) -> None:
        self.charts.connect(source, target, port, Actor.system())

    def guarded(self, chart: Chart, ends: list, x: int, y: int, guards: tuple[Guard, ...], action: str, text: str = "") -> list:
        """A column of checks from the top down, each letting the path on by its answer, then the action; the open ends are each check's other answer and the action's then."""
        checks = [self.node(chart, NodeKind.CHECK, guard.key, guard.text, x=x, y=y + 92 * i) for i, guard in enumerate(guards)]
        done = self.node(chart, NodeKind.ACTION, action, text, x=x, y=y + 92 * len(guards))
        path = [*checks, done]
        self.chain(ends, path[0])
        for guard, check, following in zip(guards, checks, path[1:]):
            self.line(check, following, guard.passes)
        return [*((check, guard.stops) for guard, check in zip(guards, checks)), (done, THEN)]

    def also_on(self, chart: Chart, event: str, x: int, y: int) -> list:
        """Another trigger of the workflow, for an event one of its values is set at; its open end."""
        return [(self.node(chart, NodeKind.TRIGGER, event, x=x, y=y), THEN)]

    def noted_on_activity(self, chart: Chart, name: str, x: int, guards: tuple[Guard, ...] = ()) -> None:
        """The time noted under the name at each of the agent's own events that show it is active."""
        for i, event in enumerate(ACTIVE):
            self.guarded(chart, self.also_on(chart, event, x + 200 * i, 460), x + 200 * i, 552, guards, "time_note", name)

    def chain(self, ends: list, target: Node) -> None:
        """Every open end given leads on to the node: a check's unused answer, an action's then, so one path runs through every part in order."""
        for source, port in ends:
            self.line(source, target, port)

    def ask_about_old_memory(self, chart: Chart, ends: list) -> list:
        """A fresh session start, not one going on after a compaction, with facts, rules or reminders snapshot long: the agent is asked whether they still hold, at most once a day."""
        return self.guarded(chart, ends, 720, 92, (Guard("after_compaction", passes=NO), Guard("memory_older_than", "memory.stale_after")), "say", STALE)

    def nothing_own(self, chart: Chart, ends: list) -> list:
        """A state with nothing of its own yet: its workflow holds the trigger alone, so the state is on the page with something to open; the Always workflows carry the rest."""
        return ends

    def log_asked(self, chart: Chart, ends: list, x: int) -> list:
        """With a task in hand, a log time never noted or ten minutes old: log where it stands."""
        held = self.node(chart, NodeKind.CHECK, "task_in_hand", x=x, y=92)
        time_check = self.node(chart, NodeKind.CHECK, "time_noted", "last_log", x=x, y=184)
        old = self.node(chart, NodeKind.CHECK, "time_over", "last_log 10 minutes", x=x, y=276)
        said = self.node(chart, NodeKind.ACTION, "say", LOG_OLD, x=x, y=368)
        self.chain(ends, held)
        self.line(held, time_check, YES)
        self.line(time_check, old, YES)
        self.line(time_check, said, NO)
        self.line(old, said, YES)
        return [(held, NO), (old, NO), (said, THEN)]

    def waiting_at_question(self, chart: Chart, ends: list) -> list:
        """An agent waiting on a question: when it is answered the agent goes back to its work, told how to read the answer."""
        return self.guarded(chart, ends, 400, 92, (Guard("question_answered"), Guard("agent_waits_on_the_question")), "release", ANSWERED)

    def expecting_at_tick(self, chart: Chart, ends: list) -> list:
        """An agent awaiting something outside: after five quiet minutes it is told to check it, with what it awaits and how long. Await and the agent's own events note when it was last active."""
        self.guarded(chart, self.also_on(chart, "awaited", 1040, 0), 1040, 92, (), "time_note", "waiting_since")
        self.noted_on_activity(chart, "waiting_since", 240)
        return self.guarded(chart, ends, 400, 92, (Guard("time_over", "waiting_since 5 minutes"),), "say", CHECK_AWAITED)

    def next_while_waiting(self, chart: Chart, ends: list) -> list:
        """An agent waiting on something in auto mode, after a quiet minute: the next task is named once for the wait, to take up if it can go on meanwhile. Await and the agent's own events note when it was last active; await forgets that the line was said, so a new wait names it again."""
        awaited = self.guarded(chart, self.also_on(chart, "awaited", 1040, 0), 1040, 92, (), "time_note", "waiting_since")
        self.guarded(chart, awaited, 1200, 92, (), "time_forget", "meanwhile_said")
        self.noted_on_activity(chart, "waiting_since", 240)
        told = self.guarded(chart, ends, 400, 92, (Guard("auto_mode"), Guard("related_tasks"), Guard("time_over", "waiting_since 1 minute"), Guard("time_noted", "meanwhile_said", passes=NO)), "say", MEANWHILE)
        return [*told[:-1], *self.guarded(chart, told[-1:], 400, 460, (), "time_note", "meanwhile_said")]

    def working_again(self, chart: Chart, ends: list) -> list:
        """The agent's own tool use ends a wait on something outside: the wait is released, with no line."""
        return self.guarded(chart, ends, 160, 92, (Guard("own_tool"),), "release")
