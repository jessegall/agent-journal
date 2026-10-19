import re
from journal.support.states_catalogue import StatesCatalogue
from journal.features.chart.seeds.support.guard import Guard
from journal.support.chart_catalogue import FORMER_TITLES, ChartCatalogue
from journal.features.chart.support.checks import COUNT_ACTIONS, COUNT_CHECKS, READINGS
from journal.support.title import LONGEST
from journal.features.chart.seeds.support.drawing import Drawing
from journal.features.registry import Registry
from journal.features.seed import Seed
from journal.support.actor import Actor
from journal.models.chart import Chart
from journal.models.node import Node
from journal.models.node_kind import NodeKind
from journal.support.title import LONGEST
from journal.repositories.agents import Agents
from journal.repositories.counts import Counts
from journal.support.drawn_line import NO, THEN, YES
from journal.repositories.charts import Charts
from journal.repositories.settings import Settings

SHIPPED_STATES = ("idle", "working", "following_plan", "awaiting", "waiting", "expecting", "stuck", "ended")
"""The states the journal ships workflows for."""
PLACE_ORDER = ("expecting", "stuck", "awaiting", "waiting", "idle", "following_plan", "working", "ended")
"""The place the shipped workflows of one event take, the waits first, and a child state before its parent, so following a plan speaks at a checkpoint before Working's lines and can end the walk there."""
SETTING = re.compile(r"\{([a-z_]+\.[a-z_]+)\}")
"""A setting a shipped title names, filled with its value when the title is drawn."""
STATELESS = (
    (":session_started:start", "Tell the agent the journal's rules, facts and what waits", "start_block"),
    (":session_started:voice", "Tell the agent how to talk to the user", "say_voice"),
    (":tool_finished:etiquette", "Remind the agent what a journal line is every {etiquette.remind_every} lines", "remind_what_a_line_is"),
    (":session_started:stale", "Ask whether facts, rules and reminders {memory.stale_after} days old still hold", "ask_about_old_memory"),
    (":session_started:version_3", "Tell the agent a version 3 journal waits to be brought across", "tell_of_version_3"),
    (":prompt_submitted:inbox", "Say what is unread", "shared_inbox"),
    (":idle:inbox", "Say what is unread", "shared_inbox"),
    (":idle:reports", "Name the worker reports not acted on", "name_reports_at_stop"),
    (":ticked:reports", "Name the worker reports not acted on every three minutes", "name_reports_on_tick"),
    (":ticked:background", "Ask the agent to look at a command running in the background every five minutes", "check_the_background"),
    (":tasks.updated:plan_next", "Tell the agent its plan's next task, or that none can start", "tell_the_plans_next_step"),
    (":workers.updated:report", "Tell the agent a worker reported, whatever it is doing", "tell_a_report_came"),
    (":tool_starting:unread_held", "Hold a write while messages stay unread after {messages.hold_after_reminders} reminders", "hold_write_while_unread"),
    (":tool_starting:inbox", "Name the unread messages every {messages.remind_every} tool uses", "name_the_unread"),
    (":tool_starting:answer_held", "Hold the tools while a read message stays unanswered", "hold_while_unanswered"),
    (":tool_starting:answer", "Ask for an answer to a read message after {messages.nudge_after} tool uses", "ask_for_an_answer"),
)
"""The Always workflows the journal ships, one subject each, in the order they run at their event: the drawing's name, its title and the builder that draws it."""
OWN = (
    ("idle", "idle", "parked", "Hold the stop while a task is parked", "parked_holds_the_stop"),
    ("idle", "idle", "broken_wait", "Hold the stop while a blocked task waits on a check that cannot run", "broken_wait_holds_the_stop"),
    ("idle", "idle", "approved", "Hold the stop while an approved plan is not started", "approved_plan_holds_the_stop"),
    ("idle", "idle", "open", "Hold the stop in auto mode while tasks are open", "open_tasks_hold_the_stop"),
    ("idle", "ticked", "parked", "Ask about a parked task after a minute of quiet", "ask_about_parked"),
    ("idle", "ticked", "blocked", "Ask about a task blocked on something outside after an hour of quiet", "ask_about_blocked"),
    ("idle", "ticked", "check_in", "Check in after half an hour of quiet in auto mode", "check_in"),
    ("working", "tool_starting", "log_held", "Hold the write when the task log is overdue", "hold_write_when_log_overdue"),
    ("working", "tool_starting", "log", "Ask for a task log after {tasks.first_nudge_after} edits", "ask_for_a_log_after_edits"),
    ("working", "tool_starting", "in_hand", "Name the task in hand every {tasks.name_every} edits", "name_the_task_in_hand"),
    ("working", "idle", "approved", "Hold the stop while an approved plan is not started", "approved_plan_holds_the_stop"),
    ("working", "idle", "carry_on", "Tell the agent to carry on with its task", "carry_on"),
    ("working", "idle", "log", "Ask for a log when the task's log is old", "ask_for_a_log"),
    ("working", "session_started", "carry_on", "Tell the agent to carry on with its task", "carry_on"),
    ("working", "session_started", "log", "Ask for a log when the task's log is old", "ask_for_a_log"),
    ("working", "session_started", "where", "Tell the agent where the work stands after a compaction", "where_the_work_stands"),
    ("working", "ticked", "quiet", "Ask how the task stands after 15 quiet minutes", "working_at_tick"),
    ("following_plan", "idle", "checkpoint_auto", "Hold the stop at a plan's checkpoint in auto mode", "checkpoint_in_auto_mode"),
    ("following_plan", "idle", "checkpoint", "Wait for the user at a plan's checkpoint", "checkpoint_waits_for_the_user"),
    ("following_plan", "session_started", "checkpoint", "Wait for the user at a plan's checkpoint", "checkpoint_waits_for_the_user"),
    ("awaiting", "workers.updated", "worker", "Tell the agent a worker reported or stopped", "tell_a_worker_is_back"),
    ("awaiting", "workers.updated", "back", "Send the agent back to its work when the last worker is back", "back_when_the_last_worker_is_back"),
    ("waiting", "questions.updated", "question", "Send the agent back to its work when the question is answered", "waiting_at_question"),
    ("expecting", "ticked", "remind", "Remind the agent what it waits for after five minutes of quiet", "expecting_at_tick"),
    ("expecting", "ticked", "meanwhile", "Point to the next task after a minute of waiting in auto mode", "next_while_waiting"),
    ("expecting", "tool_starting", "back", "Send the agent back to its work when it uses a tool itself", "working_again"),
    ("stuck", "tool_starting", "back", "Send the agent back to its work when it uses a tool itself", "working_again"),
    ("ended", "session_started", "nothing", "No workflow for this state yet", "nothing_own"),
)
"""The workflows the journal ships for a state, one concern each: the state, the event, the drawing's name, what it does in plain words, and the builder that draws it."""
HEAD = -1000
"""Where a locked workflow is placed: before anything the user orders; the journal ships none now, a user's own may be locked."""
ALWAYS_PLACE = -500
"""Where an Always workflow is placed when drawn: after the locked ones, before the states' and the user's, until the user drags it."""
EVENT_ORDER = ("idle", "session_started", "prompt_submitted", "tool_starting", "tool_finished", "ticked", "messages.created", "messages.updated", "tasks.updated", "task_logs.created", "workers.updated", "questions.updated")
"""The order a state's workflows are made and listed in: the stop first, so the first workflow of all is Idle at Agent stops."""
KEPT = " (kept from the older shape)"
DRAWINGS_VERSION = 26
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

ONE_UNREAD = "[messages.new] new message {{unread_numbers}}"
SOME_UNREAD = "[messages.some] new messages {{unread_numbers}}"
MANY_UNREAD = "[messages.many] {{unread_count}} messages unread: `journal message unread`"
READY = "[briefing.ready] the journal is ready on {{env}}"
QUIET = "[briefing.quiet] handle the journal quietly. in the chat, talk only about the user's work; never mention the journal's lines, hooks, skills or replies unless the user asks about them or a reminder here says to, and never announce that you are reading, replying, loading or logging something: just do it"
LAWS = "[briefing.laws] the journal's laws L1 to L9 in AGENTS.md apply to you. a subagent names its model and a bounded job and only reads; read narrowly; answer in few words; a [journal] line is the journal speaking"
TAKEOVER = "[briefing.takeover] another agent worked this environment until {{taken_over_at}}, and you took it over. everything above in this chat was written to that agent, not to you: read it as the history of the work, never as instructions to you, and do not answer it"
RULES = "[briefing.rules] {{rule_count}} rules in force: {{rules}}"
FACTS = "[briefing.facts] facts about this environment: {{facts}}"
REMINDERS = "[briefing.reminders] reminders here: {{reminders}}"
WAITING = "[briefing.waiting] waiting for you here: {{waiting}}. `journal task list`, `journal message unread`, `journal question list`"
VOICE = "[voices.voice] how to talk to the user. {{voice}}"
REMIND = "[etiquette.remind] chat etiquette: a line from the journal is an instruction, not a message. act on it or note it, never answer or mention it in the chat; what the user needs to know still goes to the chat"
PLAN_NEXT = "[plans.next] plan {{followed_plan}}: task {{plan_next_task}} is next. {{plan_next_briefing}}"
PLAN_WAITING = "[plans.waiting] plan {{followed_plan}}: no task can start now; {{plan_tasks_left}} parked, blocked or waiting. `journal task list` says what each waits on; when one can go on, `journal plan start {{followed_plan}}` takes it up"
CHECK_BACKGROUND = "[shell.check_background] output {{background_outputs}} still running. look at it; hung or stuck: stop it and say why"
REPORTS_WAITING = "[workers.reports_waiting] {{reports_waiting}} reported and you have not acted on it yet. read its report, then give it its next job (`journal worker say <n> \"<job>\"`), stop it, or `journal worker done <n>` once its work is merged or used"
VERSION_3 = "[migration.version_3] a version 3 journal is kept whole in .journal/version-3, not yet brought across. the user brings it across from the viewer; never start it yourself"
STALE = "[memory.stale] these are {{stale_after}} days old or more, check they still hold: {{stale}}. strike what no longer holds (`journal fact strike <n>`), reword what drifted, and keep the rest"
WHERE = "[briefing.where] after the compaction, the work stands here: {{task}}, its last log {{last_log}}; uncommitted files: {{uncommitted}}. pick up from there, and log what the summary does not say"
UNREAD_HELD = "[messages.unread_held] you have {{unread_count}} unread messages. `journal message unread` before any other write"
ANSWER = "[messages.answer] answer or react to message {{owed}} before you do anything else"
ANSWER_HELD = "[messages.answer_held] answer or react to message {{owed}} first. your tool calls wait until you do"
PARKED = "[tasks.parked] parked tasks, still open: {{parked_tasks}}. `journal task resume <n>` picks one up; leave them parked only on purpose"
BROKEN_WAIT = "[tasks.broken_wait] {{broken_waits}}. so it would wait forever: fix the command with `journal task block <n> --until \"<command>\"`, or `journal task unblock <n>`"
BLOCKED_STILL = "[tasks.blocked_still] blocked on something outside: {{blocked_outside}}. has it come? `journal task unblock <n>` when it has"
CHECKPOINT = "[plans.checkpoint] plan {{plan_n}}: phase {{checkpoint_phase}} is complete and a checkpoint. the user looks before the next phase; wait for their word, then `journal plan start {{plan_n}}`"
CHECKPOINT_PASSED = "[plans.checkpoint_passed] plan {{plan_n}}: phase {{checkpoint_phase}} is complete, and in auto mode it does not stop you. `journal plan start {{plan_n}}` begins the next phase; carry on"
NEXT = "[tasks.next] tasks are open, and auto mode is on: task {{next_task}} next: {{next_task_title}}. sure you want to stop? carry on with it, or `journal stuck \"<why>\"` if you are truly stuck"
PARKED_STILL = "[tasks.parked_still] task {{parked_n}} is still parked: can you continue it now? It was parked because: {{parked_why}}. `journal task resume {{parked_n}}` picks it up again"
CHECK_IN = "[tasks.check_in] nothing has happened for half an hour: is there anything left for you to do? Carry on, take the next task, or say so in one line"
LOG_OVERDUE = "[tasks.log_overdue] {{task_edits}} edits since you logged {{task}}. {{log_command}} \"<what was decided or done, and why>\" before any other write"
LOG_SOON = "[tasks.log_soon] {{task_edits}} edits since you logged {{task}}: say where it stands. {{log_command}} \"<where it stands>\""
IN_HAND = "[tasks.in_hand] {{task}} in hand, {{task_edits}} edits. if this is not what you are doing, finish it or park it and start the work you are on"
CARRY_ON = "[tasks.carry_on] {{task}} is in hand, {{logged}}: carry on. `journal stuck \"<why>\"` if you are truly stuck"
LOG_OLD = "[tasks.log_old] {{task}}, {{logged}}: log where it stands first. {{log_command}} \"<where it stands>\""
STILL_OPEN = "[tasks.open] {{task}} is still open: log where it stands or finish it"
REPORTED = "[workers.reported] worker {{worker_n}}, {{worker_name}}, reported in the chat"
STOPPED = "[workers.stopped] worker {{worker_n}}, {{worker_name}}, stopped before it reported"
RETURNED = "[workers.returned] what you waited on came back: carry on"
ANSWERED = "question {{question_n}} is answered. `journal question show {{question_n}}` reads it whole, with the messages linked to it; act on the answer"
APPROVED_UNSTARTED = "[plans.approved_unstarted] plan {{approved_plan}} is approved and not started: `journal plan start {{approved_plan}}` begins its first task"
MEANWHILE = "[tasks.meanwhile] while you wait for {{awaited}}, task {{related_task}} is next: if you can work on it meanwhile, carry on with it; if you need the output first, waiting is fine"
CHECK_AWAITED = "[tasks.check_awaited] check {{awaited}} now: you have waited {{quiet_minutes}} min. look at it. Still going: `journal await` again. Done or failed: log what came of it and take the next step"
class ShippedChart(Seed):
    """The workflows the journal ships: the conduct for every state as an Always workflow per shared event and the guards as a locked one, then one per state per trigger it has steps of its own at: made at boot where absent, redrawn when unedited and the shipped drawing is newer, and left alone when the user edited it. Workflows of the older shapes, bound to one event with no state or to a state with no event, retire at boot."""

    def __init__(self, charts: Charts, catalogue: ChartCatalogue, settings: Settings, states: StatesCatalogue, agents: Agents, counts: Counts, registry: Registry) -> None:
        self.states, self.agents, self.counts, self.registry = states, agents, counts, registry
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
        self.retire_the_older_shape(by)
        self.retire_unpaired(by)
        self.rewrite_retired_checks(by)
        self.retire_workflows_of_states_gone(by)
        self.stop_what_names_an_unknown_entry(by)
        self.stop_what_reads_a_count_it_does_not_keep(by)
        self.name_the_shipped(by)
        self.retitle_the_shipped(by)
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
        self.rewrite_retired_checks(by)
        self.stop_what_names_an_unknown_entry(by)
        self.settings.set(DRAWINGS_VERSION_KEY, DRAWINGS_VERSION, by)

    def release_what_no_drawing_names(self, by: Actor) -> None:
        """A shipped workflow whose drawing the journal no longer ships, a state's at an event it has nothing of its own at: gone when unedited, else the user's own, its shared conduct stripped, still bound where it was."""
        for chart in [c for c in self.charts.shipped() if c.drawing and c.drawing not in self.drawings]:
            if all(n.shipped for n in self.charts.nodes_of(chart)):
                self.charts.remove(chart, by)
                continue
            self.strip(chart, by)
            self.strip_what_its_drawings_carry(chart, by)
            self.charts.save(chart.with_(shipped=False, locked=False, drawing="", title=chart.title + KEPT), by)

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
        chart = self.charts.save(Chart(title=drawing.title, shipped=True, locked=drawing.locked, state=state, event=event, drawing=key, drawn_version=DRAWINGS_VERSION, place=place), by)
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
        self.charts.save(chart.with_(shipped=False, state="", event="", title=chart.title + KEPT), by)

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

    def stop_what_reads_a_count_it_does_not_keep(self, by: Actor) -> None:
        """A user's workflow reading a count none of its own nodes starts or counts, which another workflow kept before each kept its own, is stopped at boot, its triggers taken out and its title saying why."""
        for chart in [c for c in self.charts.all() if not c.shipped]:
            nodes = self.charts.nodes_of(chart)
            kept = {n.text.strip().partition(" ")[0] for n in nodes if n.key in COUNT_ACTIONS}
            foreign = sorted({n.text.strip().partition(" ")[0] for n in nodes if n.key in COUNT_CHECKS} - kept - set(READINGS) - {""})
            triggers = [n for n in nodes if n.kind == NodeKind.TRIGGER]
            if not foreign or not triggers:
                continue
            for trigger in triggers:
                self.charts.remove_node(trigger, by)
            why = f" (off, reads another's count {foreign[0]})"
            self.charts.save(chart.with_(title=chart.title[:LONGEST - len(why)].rstrip() + why), by)

    def reset(self, chart: Chart, by: Actor) -> Chart:
        """A shipped workflow as shipped again: every node and line gone, its drawing drawn anew at the place it ships at, one more revision."""
        drawing = self.drawings[chart.drawing or self.key_of(chart.state, chart.event)]
        for node in self.charts.nodes_of(chart):
            self.charts.remove_node(node, by)
        drawing.draw(chart)
        place = self.shipped_place(chart.drawing) if chart.drawing in self.drawings else chart.place
        return self.charts.save(chart.saved_again().with_(title=drawing.title, drawing=chart.drawing or self.key_of(chart.state, chart.event), drawn_version=DRAWINGS_VERSION, place=place), by)

    def node(self, chart: Chart, kind: NodeKind, key: str, text: str = "", x: int = 0, y: int = 0, locked: bool | None = None) -> Node:
        """A shipped node; a hold is a guard of the journal's protocol and is drawn locked, as is any node the drawing says so of."""
        return self.charts.add_node(chart, Node(kind=kind, key=key, text=text, x=x, y=y, shipped=True, locked=bool(locked)), Actor.system())

    def trigger(self, chart: Chart) -> Node:
        """The workflow's one trigger, the event it is for, made where it is not yet."""
        standing = next((n for n in self.charts.nodes_of(chart) if n.kind == NodeKind.TRIGGER), None)
        return standing or self.node(chart, NodeKind.TRIGGER, chart.event, x=400, y=0)

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

    def chain(self, ends: list, target: Node) -> None:
        """Every open end given leads on to the node: a check's unused answer, an action's then, so one path runs through every part in order."""
        for source, port in ends:
            self.line(source, target, port)

    def start_block(self, chart: Chart, ends: list) -> list:
        """The start block, line by line: ready, quiet, the laws (locked), a takeover when another session worked here lately, the rules, facts and reminders when there are any, and what waits."""
        x, y = 720, 92
        ready = self.node(chart, NodeKind.ACTION, "say", READY, x=x, y=y)
        quiet = self.node(chart, NodeKind.ACTION, "say", QUIET, x=x, y=y + 92)
        laws = self.node(chart, NodeKind.ACTION, "say", LAWS, x=x, y=y + 184, locked=True)
        self.chain(ends, ready)
        self.line(ready, quiet, THEN)
        self.line(quiet, laws, THEN)
        ends = [(laws, THEN)]
        y += 276
        for check, line in (("taken_over", TAKEOVER), ("has_rules", RULES), ("has_facts", FACTS), ("has_reminders", REMINDERS), ("something_waiting", WAITING)):
            asked = self.node(chart, NodeKind.CHECK, check, x=x, y=y)
            said = self.node(chart, NodeKind.ACTION, "say", line, x=x - 160, y=y + 92)
            self.chain(ends, asked)
            self.line(asked, said, YES)
            ends = [(asked, NO), (said, THEN)]
            y += 184
        return ends

    def remind_what_a_line_is(self, chart: Chart, ends: list) -> list:
        """After the agent's own tool use, once the journal has said so many lines since the last reminder: a journal line is an instruction, not a message."""
        return self.guarded(chart, ends, 720, 92, (Guard("own_tool"), Guard("count_over", "lines etiquette.remind_every")), "say", REMIND)

    def ask_about_old_memory(self, chart: Chart, ends: list) -> list:
        """A fresh session start, not one going on after a compaction, with facts, rules or reminders standing long: the agent is asked whether they still hold, at most once a day."""
        return self.guarded(chart, ends, 720, 92, (Guard("after_compaction", passes=NO), Guard("memory_older_than", "memory.stale_after")), "say", STALE)

    def tell_the_plans_next_step(self, chart: Chart, ends: list) -> list:
        """A task of a plan closes: the agent is told, by typing since no hook waits on a row's change, the task the plan moved on to, or that none can start and why."""
        ends = self.guarded(chart, ends, 720, 92, (Guard("plan_moved_on"),), "type", PLAN_NEXT)
        return self.guarded(chart, ends, 1040, 92, (Guard("plan_left_waiting"),), "type", PLAN_WAITING)

    def name_reports_at_stop(self, chart: Chart, ends: list) -> list:
        """A stop while a worker's report waits to be acted on: the agent is told which."""
        return self.guarded(chart, ends, 720, 92, (Guard("worker_report_waiting"),), "say", REPORTS_WAITING)

    def check_the_background(self, chart: Chart, ends: list) -> list:
        return self.guarded(chart, ends, 720, 92, (Guard("background_over", "5 minutes"),), "type", CHECK_BACKGROUND)

    def name_reports_on_tick(self, chart: Chart, ends: list) -> list:
        """As the clock ticks while a worker's report waits to be acted on: the agent is told which, by typing, at most every three minutes."""
        return self.guarded(chart, ends, 720, 92, (Guard("worker_report_waiting"),), "type", REPORTS_WAITING)

    def tell_a_report_came(self, chart: Chart, ends: list) -> list:
        """A worker reports while the agent is not waiting on it: the agent is told at once, by typing; one waiting on it is told by its waiting state."""
        return self.guarded(chart, ends, 720, 92, (Guard("worker_reported"), Guard("agent_awaits_the_worker", passes=NO)), "type", REPORTED)

    def tell_of_version_3(self, chart: Chart, ends: list) -> list:
        """A version 3 journal kept by the installer and not yet brought across: the agent knows it is there and leaves it to the user."""
        return self.guarded(chart, ends, 720, 92, (Guard("version_3_waiting"),), "say", VERSION_3)

    def say_voice(self, chart: Chart, ends: list) -> list:
        """How to talk to the user, from the chosen voice."""
        return self.guarded(chart, ends, 720, 92, (), "say", VOICE)

    def shared_inbox(self, chart: Chart, ends: list) -> list:
        """The inbox named at a start, a prompt and a stop."""
        return self.draw_inbox(chart, ends, x=720, y=92)

    def hold_write_while_unread(self, chart: Chart, ends: list) -> list:
        """The agent's own write while messages stay unread after so many reminders: held until they are read."""
        own = self.node(chart, NodeKind.CHECK, "own_tool", x=720, y=92)
        unread = self.node(chart, NodeKind.CHECK, "unread_messages", x=720, y=184)
        reminded = self.node(chart, NodeKind.CHECK, "count_over", "namings messages.hold_after_reminders", x=720, y=276)
        writes = self.node(chart, NodeKind.CHECK, "tool_writes", x=720, y=368)
        held = self.node(chart, NodeKind.ACTION, "hold", UNREAD_HELD, x=720, y=460)
        self.chain(ends, own)
        self.line(own, unread, YES)
        self.line(unread, reminded, YES)
        self.line(reminded, writes, YES)
        self.line(writes, held, YES)
        return [(own, NO), (unread, NO), (reminded, NO), (writes, NO), (held, THEN)]

    def name_the_unread(self, chart: Chart, ends: list) -> list:
        """The agent's own tool use every so many since the newest message came: the unread messages are named."""
        own = self.node(chart, NodeKind.CHECK, "own_tool", x=720, y=0)
        every = self.node(chart, NodeKind.CHECK, "count_every", "uses messages.remind_every", x=720, y=92)
        self.chain(ends, own)
        self.line(own, every, YES)
        return [(own, NO), (every, NO), *self.draw_inbox(chart, [(every, YES)], x=720, y=184)]

    def hold_while_unanswered(self, chart: Chart, ends: list) -> list:
        """The agent's own tool use while a read message stays unanswered past so many uses: held, a journal command and a read of the message's own files going through."""
        own = self.node(chart, NodeKind.CHECK, "own_tool", x=720, y=0)
        owed = self.node(chart, NodeKind.CHECK, "unanswered_messages", x=720, y=92)
        journal = self.node(chart, NodeKind.CHECK, "journal_command", x=720, y=184)
        theirs = self.node(chart, NodeKind.CHECK, "tool_reads_their_files", x=720, y=276)
        past = self.node(chart, NodeKind.CHECK, "count_over", "owed messages.hold_after", x=720, y=368)
        held = self.node(chart, NodeKind.ACTION, "hold", ANSWER_HELD, x=720, y=460)
        self.chain(ends, own)
        self.line(own, owed, YES)
        self.line(owed, journal, YES)
        self.line(journal, theirs, NO)
        self.line(theirs, past, NO)
        self.line(past, held, YES)
        return [(own, NO), (owed, NO), (journal, YES), (theirs, YES), (past, NO), (held, THEN)]

    def ask_for_an_answer(self, chart: Chart, ends: list) -> list:
        """The agent's own tool use after so many with a read message unanswered: it is asked to answer."""
        return self.guarded(chart, ends, 720, 0, (Guard("own_tool"), Guard("unanswered_messages"), Guard("count_over", "owed messages.nudge_after")), "say", ANSWER)

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

    def parked_holds_the_stop(self, chart: Chart, ends: list) -> list:
        """A parked task holds the stop, in any mode, naming the parked ones."""
        return self.guarded(chart, ends, 160, 92, (Guard("parked_tasks"),), "block_stop", PARKED)

    def broken_wait_holds_the_stop(self, chart: Chart, ends: list) -> list:
        return self.guarded(chart, ends, 160, 92, (Guard("broken_waits"),), "block_stop", BROKEN_WAIT)

    def approved_plan_holds_the_stop(self, chart: Chart, ends: list) -> list:
        """A plan the user approved and the agent has not started holds the stop, in any mode, until it is started."""
        return self.guarded(chart, ends, 160, 92, (Guard("approved_plan"),), "block_stop", APPROVED_UNSTARTED)

    def open_tasks_hold_the_stop(self, chart: Chart, ends: list) -> list:
        """In auto mode an open task holds the stop, naming the next one."""
        return self.guarded(chart, ends, 160, 92, (Guard("auto_mode"), Guard("open_tasks")), "block_stop", NEXT)

    def checkpoint_in_auto_mode(self, chart: Chart, ends: list) -> list:
        """A plan at a checkpoint in auto mode: the stop is held and the agent goes on; holding the stop ends the walk."""
        return self.guarded(chart, ends, 240, 92, (Guard("plan_at_checkpoint"), Guard("auto_mode")), "block_stop", CHECKPOINT_PASSED)

    def checkpoint_waits_for_the_user(self, chart: Chart, ends: list) -> list:
        """A plan at a checkpoint with auto mode off: the agent is told the user looks first."""
        return self.guarded(chart, ends, 240, 92, (Guard("plan_at_checkpoint"), Guard("auto_mode", passes=NO)), "say", CHECKPOINT)

    def ask_about_parked(self, chart: Chart, ends: list) -> list:
        """As the clock ticks on an agent at rest with a parked task: after a minute of quiet, ask whether it can go on."""
        return self.guarded(chart, ends, 240, 92, (Guard("parked_tasks"), Guard("quiet_for_over", "1 minute")), "type", PARKED_STILL)

    def ask_about_blocked(self, chart: Chart, ends: list) -> list:
        return self.guarded(chart, ends, 240, 92, (Guard("blocked_outside"), Guard("quiet_for_over", "1 hour")), "type", BLOCKED_STILL)

    def check_in(self, chart: Chart, ends: list) -> list:
        """As the clock ticks on an agent at rest in auto mode: after half an hour of quiet, check in."""
        return self.guarded(chart, ends, 240, 92, (Guard("auto_mode"), Guard("quiet_for_over", "30 minutes")), "type", CHECK_IN)

    def hold_write_when_log_overdue(self, chart: Chart, ends: list) -> list:
        """A write with the task's log overdue, by the edits since it: held until the log."""
        return self.guarded(chart, ends, 160, 0, (Guard("own_tool"), Guard("tool_writes"), Guard("count_over", "edits tasks.log_after")), "hold", LOG_OVERDUE)

    def ask_for_a_log_after_edits(self, chart: Chart, ends: list) -> list:
        """A write at the first threshold of edits since the log: say where the task stands."""
        return self.guarded(chart, ends, 160, 0, (Guard("own_tool"), Guard("tool_writes"), Guard("count_at", "edits tasks.first_nudge_after")), "say", LOG_SOON)

    def name_the_task_in_hand(self, chart: Chart, ends: list) -> list:
        """A write every so many edits since the log: the task in hand is named, so drift is noticed."""
        return self.guarded(chart, ends, 160, 0, (Guard("own_tool"), Guard("tool_writes"), Guard("count_every", "edits tasks.name_every")), "say", IN_HAND)

    def nothing_own(self, chart: Chart, ends: list) -> list:
        """A state with nothing of its own yet: its workflow holds the trigger alone, so the state is on the page with something to open; the Always workflows carry the rest."""
        return ends

    def carry_on(self, chart: Chart, ends: list) -> list:
        """A task in hand at a stop or a session start: carry on."""
        return self.guarded(chart, ends, 240, 92, (Guard("task_in_hand"),), "say", CARRY_ON)

    def where_the_work_stands(self, chart: Chart, ends: list) -> list:
        """A session going on after its context was compacted, with a task in hand: the task, its last log line whole and the files not committed."""
        return self.guarded(chart, ends, 240, 92, (Guard("after_compaction"),), "say", WHERE)

    def ask_for_a_log(self, chart: Chart, ends: list) -> list:
        """A task in hand whose log is old, at a stop or a session start: log where it stands."""
        return self.guarded(chart, ends, 240, 92, (Guard("task_in_hand"), Guard("log_stale_over", "10 minutes")), "say", LOG_OLD)

    def working_at_tick(self, chart: Chart, ends: list) -> list:
        """A task in hand as the clock ticks: still open after a quiet quarter hour."""
        return self.guarded(chart, ends, 400, 92, (Guard("quiet_for_over", "15 minutes"),), "say", STILL_OPEN)

    def tell_a_worker_is_back(self, chart: Chart, ends: list) -> list:
        """A worker the agent awaits reports or stops: the agent is told, by typing, since it may be sitting at its prompt."""
        for column, came, told in ((240, "worker_reported", REPORTED), (560, "worker_stopped", STOPPED)):
            ends = self.guarded(chart, ends, column, 92, (Guard(came), Guard("agent_awaits_the_worker")), "type", told)
        return ends

    def back_when_the_last_worker_is_back(self, chart: Chart, ends: list) -> list:
        """The last worker the agent awaits is back: the agent goes back to what it was doing."""
        return self.guarded(chart, ends, 240, 92, (Guard("agent_awaits_the_worker"), Guard("last_worker_back")), "release", RETURNED)

    def waiting_at_question(self, chart: Chart, ends: list) -> list:
        """An agent waiting on a question: when it is answered the agent goes back to its work, told how to read the answer."""
        return self.guarded(chart, ends, 400, 92, (Guard("question_answered"), Guard("agent_waits_on_the_question")), "release", ANSWERED)

    def expecting_at_tick(self, chart: Chart, ends: list) -> list:
        """An agent awaiting something outside: after five quiet minutes it is told to check it, with what it awaits and how long."""
        return self.guarded(chart, ends, 400, 92, (Guard("quiet_for_over", "5 minutes"),), "say", CHECK_AWAITED)

    def next_while_waiting(self, chart: Chart, ends: list) -> list:
        """An agent waiting on something in auto mode, after a quiet minute: the next task is named, to take up if it can go on meanwhile."""
        return self.guarded(chart, ends, 400, 92, (Guard("auto_mode"), Guard("related_tasks"), Guard("quiet_for_over", "1 minute")), "say", MEANWHILE)

    def working_again(self, chart: Chart, ends: list) -> list:
        """The agent's own tool use ends a wait on something outside: the wait is released, with no line."""
        return self.guarded(chart, ends, 160, 92, (Guard("own_tool"),), "release")
