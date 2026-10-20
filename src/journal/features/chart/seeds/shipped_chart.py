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
    (":tasks.updated:parked_at_close", "Name a parked task when a task closes", "name_parked_at_close"),
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
    ("idle", "ticked", "blocked", "Ask about a blocked task nothing opens by itself after 45 minutes of quiet", "ask_about_blocked"),
    ("idle", "ticked", "check_in", "Check in after half an hour of quiet in auto mode", "check_in"),
    ("working", "tool_starting", "log_held", "Hold the write when the task log is overdue", "hold_write_when_log_overdue"),
    ("working", "tool_starting", "log", "Ask for a task log after {tasks.first_nudge_after} edits", "ask_for_a_log_after_edits"),
    ("working", "tool_starting", "in_hand", "Name the task in hand every {tasks.name_every} edits", "name_the_task_in_hand"),
    ("working", "idle", "approved", "Hold the stop while an approved plan is not started", "approved_plan_holds_the_stop"),
    ("working", "idle", "carry_on", "Tell the agent to carry on with its task", "carry_on"),
    ("working", "idle", "log", "Ask for a log when the task's log is old", "ask_for_a_log"),
    ("working", "session_started", "carry_on", "Tell the agent to carry on with its task", "carry_on"),
    ("working", "session_started", "where", "Tell the agent where the work stands after a compaction", "where_the_work_stands"),
    ("working", "ticked", "quiet", "Ask how the task stands after 15 quiet minutes", "working_at_tick"),
    ("following_plan", "idle", "checkpoint_auto", "Hold the stop at a plan's checkpoint in auto mode", "checkpoint_in_auto_mode"),
    ("following_plan", "idle", "checkpoint", "Wait for the user at a plan's checkpoint", "checkpoint_waits_for_the_user"),
    ("following_plan", "session_started", "checkpoint", "Wait for the user at a plan's checkpoint", "checkpoint_waits_for_the_user"),
    ("awaiting", "workers.updated", "worker", "Tell the agent a worker reported or stopped", "tell_a_worker_is_back"),
    ("awaiting", "workers.updated", "back", "Send the agent back to its work when the last worker is back", "back_when_the_last_worker_is_back"),
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
BLOCKED_STILL = "[tasks.unblock_what_has_come] blocked, with nothing that opens it by itself: {{blocked_outside}}. has what it waits on come? `journal task unblock <n>` when it has"
CHECKPOINT = "[plans.phase_complete_at_a_checkpoint] plan {{plan_n}}: phase {{checkpoint_phase}} is complete and a checkpoint. the user looks before the next phase; wait for their word, then `journal plan start {{plan_n}}`"
CHECKPOINT_PASSED = "[plans.phase_complete_go_on] plan {{plan_n}}: phase {{checkpoint_phase}} is complete, and in auto mode it does not stop you. `journal plan start {{plan_n}}` begins the next phase; carry on"
NEXT = "[tasks.next_task_holds_the_stop] tasks are open, and auto mode is on: task {{next_task}} next: {{next_task_title}}. sure you want to stop? carry on with it, or `journal stuck \"<why>\"` if you are truly stuck"
PARKED_AT_CLOSE = "[tasks.continue_the_parked_task_at_close] task {{parked_n}} is still parked: can you continue it now? It was parked because: {{parked_why}}. `journal task resume {{parked_n}}` picks it up again"
PARKED_STILL = "[tasks.continue_the_parked_task] task {{parked_n}} is still parked: can you continue it now? It was parked because: {{parked_why}}. `journal task resume {{parked_n}}` picks it up again"
CHECK_IN = "[tasks.anything_left_to_do] nothing has happened for half an hour: is there anything left for you to do? Carry on, take the next task, or say so in one line"
LOG_OVERDUE = "[tasks.write_held_until_logged] {{value.writes}} edits since you logged {{task}}. {{log_command}} \"<what was decided or done, and why>\" before any other write"
LOG_SOON = "[tasks.log_where_it_stands] {{value.writes}} edits since you logged {{task}}: say where it stands. {{log_command}} \"<where it stands>\""
IN_HAND = "[tasks.task_in_hand_named_back] {{task}} in hand, {{value.writes}} edits. if this is not what you are doing, finish it or park it and start the work you are on"
CARRY_ON = "[tasks.carry_on] {{task}} is in hand, {{logged}}: carry on. `journal stuck \"<why>\"` if you are truly stuck"
LOG_OLD = "[tasks.log_first_at_stop] {{task}}, {{logged.last_log}}: log where it stands first. {{log_command}} \"<where it stands>\""
STILL_OPEN = "[tasks.task_still_open] {{task}} is still open: log where it stands or finish it"
REPORTED = "[workers.worker_reported] worker {{worker_n}}, {{worker_name}}, reported in the chat"
STOPPED = "[workers.worker_stopped_unreported] worker {{worker_n}}, {{worker_name}}, stopped before it reported"
RETURNED = "[workers.waited_on_came_back] what you waited on came back: carry on"
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

    def remind_what_a_line_is(self, chart: Chart, ends: list) -> list:
        """After the agent's own tool use, once the journal has said so many lines since the last reminder: a journal line is an instruction, not a message. Every line said counts one, the reminder itself starting the count at zero."""
        said = self.also_on(chart, "line_said", 1040, 0)
        reminder = self.node(chart, NodeKind.CHECK, "line_is", "etiquette.a_line_is_an_instruction", x=1040, y=92)
        self.chain(said, reminder)
        self.line(reminder, self.node(chart, NodeKind.ACTION, "count_start", "said", x=880, y=184), YES)
        self.line(reminder, self.node(chart, NodeKind.ACTION, "count_one", "said", x=1200, y=184), NO)
        return self.guarded(chart, ends, 720, 92, (Guard("own_tool"), Guard("count_over", "said etiquette.remind_every")), "say", REMIND)

    def ask_about_old_memory(self, chart: Chart, ends: list) -> list:
        """A fresh session start, not one going on after a compaction, with facts, rules or reminders standing long: the agent is asked whether they still hold, at most once a day."""
        return self.guarded(chart, ends, 720, 92, (Guard("after_compaction", passes=NO), Guard("memory_older_than", "memory.stale_after")), "say", STALE)

    def tell_the_plans_next_step(self, chart: Chart, ends: list) -> list:
        """A task of a plan closes: the agent is told, by typing since no hook waits on a row's change, the task the plan moved on to, or that none can start and why."""
        ends = self.guarded(chart, ends, 720, 92, (Guard("plan_moved_on"),), "type", PLAN_NEXT)
        return self.guarded(chart, ends, 1040, 92, (Guard("plan_left_waiting"),), "type", PLAN_WAITING)

    def name_parked_at_close(self, chart: Chart, ends: list) -> list:
        """A task closes, by command or by a commit, with no task in hand and no plan going on: the agent is told, by typing since no hook waits on a row's change, of a task still parked."""
        return self.guarded(chart, ends, 720, 92, (Guard("task_just_done"), Guard("task_in_hand", passes=NO), Guard("plan_moved_on", passes=NO), Guard("parked_tasks")), "type", PARKED_AT_CLOSE)

    def name_reports_at_stop(self, chart: Chart, ends: list) -> list:
        """A stop while a worker's report waits to be acted on: the agent is told which."""
        return self.guarded(chart, ends, 720, 92, (Guard("worker_report_waiting"),), "say", REPORTS_WAITING)

    def check_the_background(self, chart: Chart, ends: list) -> list:
        """A command moved to the background with none running before it notes the time; as the clock ticks while one still runs, five minutes after, the agent is asked to look."""
        self.guarded(chart, self.also_on(chart, "command_moved", 1040, 0), 1040, 92, (Guard("background_running", "2", passes=NO),), "time_note", "running_since")
        return self.guarded(chart, ends, 720, 92, (Guard("background_running", "1"), Guard("time_over", "running_since 5 minutes")), "type", CHECK_BACKGROUND)

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
        """The agent's own write while messages stay unread after so many reminders: held until they are read. It counts the agent's own tool uses since the newest message came, and a naming at every reminder's interval, as the inbox workflow names them."""
        arrived = self.also_on(chart, "messages.created", 1200, 0)
        restart = self.guarded(chart, arrived, 1200, 92, (Guard("message_by_user"), Guard("message_typed_in_terminal", passes=NO)), "count_start", "tools_used")
        self.guarded(chart, [end for end in restart if end[0].key == "count_start"], 1200, 368, (), "count_start", "times_named")
        own = self.node(chart, NodeKind.CHECK, "own_tool", x=720, y=92)
        unread = self.node(chart, NodeKind.CHECK, "unread_messages", x=720, y=184)
        self.chain(ends, own)
        self.line(own, unread, YES)
        self.guarded(chart, self.guarded(chart, [(unread, NO)], 960, 276, (), "count_start", "tools_used"), 960, 368, (), "count_start", "times_named")
        counted = self.guarded(chart, [(unread, YES)], 720, 276, (), "count_one", "tools_used")
        every = self.node(chart, NodeKind.CHECK, "count_every", "tools_used messages.remind_every", x=720, y=368)
        self.chain(counted, every)
        named = self.guarded(chart, [(every, YES)], 560, 460, (), "count_one", "times_named")
        reminded = self.node(chart, NodeKind.CHECK, "count_over", "times_named messages.hold_after_reminders", x=720, y=552)
        self.chain([*named, (every, NO)], reminded)
        return [(own, NO), *self.guarded(chart, [(reminded, YES)], 720, 644, (Guard("tool_writes"),), "hold", UNREAD_HELD), (reminded, NO)]

    def name_the_unread(self, chart: Chart, ends: list) -> list:
        """The agent's own tool use every so many since the newest message came: the unread messages are named. A message from you starts the count again; with nothing unread it stands at zero."""
        arrived = self.also_on(chart, "messages.created", 1200, 0)
        self.guarded(chart, arrived, 1200, 92, (Guard("message_by_user"), Guard("message_typed_in_terminal", passes=NO)), "count_start", "tools_used")
        own = self.node(chart, NodeKind.CHECK, "own_tool", x=720, y=0)
        unread = self.node(chart, NodeKind.CHECK, "unread_messages", x=720, y=92)
        self.chain(ends, own)
        self.line(own, unread, YES)
        self.guarded(chart, [(unread, NO)], 960, 184, (), "count_start", "tools_used")
        counted = self.guarded(chart, [(unread, YES)], 720, 184, (), "count_one", "tools_used")
        every = self.node(chart, NodeKind.CHECK, "count_every", "tools_used messages.remind_every", x=720, y=276)
        self.chain(counted, every)
        return [(own, NO), (every, NO), *self.draw_inbox(chart, [(every, YES)], x=720, y=368)]

    def hold_while_unanswered(self, chart: Chart, ends: list) -> list:
        """The agent's own tool use while a read message stays unanswered past so many uses: held, a journal command and a read of the message's own files going through. It counts the agent's own tool uses while one stays unanswered, at zero while none does."""
        own, owed = self.owed_counted(chart, ends)
        journal = self.node(chart, NodeKind.CHECK, "journal_command", x=720, y=276)
        theirs = self.node(chart, NodeKind.CHECK, "tool_reads_their_files", x=720, y=368)
        past = self.node(chart, NodeKind.CHECK, "count_over", "uses_unanswered messages.hold_after", x=720, y=460)
        held = self.node(chart, NodeKind.ACTION, "hold", ANSWER_HELD, x=720, y=552)
        self.chain(owed, journal)
        self.line(journal, theirs, NO)
        self.line(theirs, past, NO)
        self.line(past, held, YES)
        return [(own, NO), (journal, YES), (theirs, YES), (past, NO), (held, THEN)]

    def ask_for_an_answer(self, chart: Chart, ends: list) -> list:
        """The agent's own tool use after so many with a read message unanswered: it is asked to answer. It counts as the hold does, on its own."""
        own, owed = self.owed_counted(chart, ends)
        return [(own, NO), *self.guarded(chart, owed, 720, 276, (Guard("count_over", "uses_unanswered messages.nudge_after"),), "say", ANSWER)]

    def owed_counted(self, chart: Chart, ends: list) -> tuple[Node, list]:
        """The agent's own tool use counted one up under uses_unanswered while a read message stays unanswered, uses_unanswered set to zero while none does; the own-tool check and the open end after the count."""
        own = self.node(chart, NodeKind.CHECK, "own_tool", x=720, y=0)
        unanswered = self.node(chart, NodeKind.CHECK, "unanswered_messages", x=720, y=92)
        self.chain(ends, own)
        self.line(own, unanswered, YES)
        self.guarded(chart, [(unanswered, NO)], 960, 184, (), "count_start", "uses_unanswered")
        return own, self.guarded(chart, [(unanswered, YES)], 720, 184, (), "count_one", "uses_unanswered")

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
        return self.asked_after_quiet(chart, ends, "task_just_parked", "parked_tasks", "1 minute", PARKED_STILL)

    def ask_about_blocked(self, chart: Chart, ends: list) -> list:
        """As the clock ticks on an agent at rest with a blocked task nothing opens by itself: after 45 minutes of quiet, before an hour of it ends the session, ask whether it has come."""
        return self.asked_after_quiet(chart, ends, "task_just_blocked", "blocked_outside", "45 minutes", BLOCKED_STILL)

    def asked_after_quiet(self, chart: Chart, ends: list, moved: str, waiting: str, quiet: str, line: str) -> list:
        """A task's move into its wait and the agent's own events note when it was last active; on the tick, with a task still so, after so long a quiet the agent is asked by typing."""
        self.guarded(chart, self.also_on(chart, "tasks.updated", 1040, 0), 1040, 92, (Guard(moved),), "time_note", "last_active")
        self.noted_on_activity(chart, "last_active", 240)
        return self.guarded(chart, ends, 240, 92, (Guard(waiting), Guard("time_over", f"last_active {quiet}")), "type", line)

    def check_in(self, chart: Chart, ends: list) -> list:
        """As the clock ticks on an agent at rest in auto mode: after half an hour of quiet, check in. A task's change and the agent's own events note when it was last active."""
        self.guarded(chart, self.also_on(chart, "tasks.updated", 1040, 0), 1040, 92, (), "time_note", "last_active")
        self.noted_on_activity(chart, "last_active", 240)
        return self.guarded(chart, ends, 240, 92, (Guard("auto_mode"), Guard("time_over", "last_active 30 minutes")), "type", CHECK_IN)

    def hold_write_when_log_overdue(self, chart: Chart, ends: list) -> list:
        """A write with the task's log overdue, by the writes since it: held until the log."""
        return self.writes_counted(chart, ends, Guard("count_over", "writes tasks.log_after"), "hold", LOG_OVERDUE)

    def ask_for_a_log_after_edits(self, chart: Chart, ends: list) -> list:
        """A write at the first threshold of writes since the log: say where the task stands."""
        return self.writes_counted(chart, ends, Guard("count_at", "writes tasks.first_nudge_after"), "say", LOG_SOON)

    def name_the_task_in_hand(self, chart: Chart, ends: list) -> list:
        """A write every so many writes since the log: the task in hand is named, so drift is noticed."""
        return self.writes_counted(chart, ends, Guard("count_every", "writes tasks.name_every"), "say", IN_HAND)

    def writes_counted(self, chart: Chart, ends: list, asked: Guard, action: str, text: str) -> list:
        """The agent's own writes since its task was taken in hand or last logged: a write asks the count as it stands, then, when no step held it, counts one up."""
        for i, (event, guard) in enumerate((("tasks.updated", "task_just_taken"), ("task_logs.created", "log_for_task_in_hand"))):
            self.guarded(chart, self.also_on(chart, event, 640 + 240 * i, 0), 640 + 240 * i, 92, (Guard(guard),), "count_start", "writes")
        written = self.guarded(chart, ends, 160, 0, (Guard("own_tool"), Guard("tool_writes"), asked), action, text)
        counted = self.node(chart, NodeKind.CHECK, "held_already", x=160, y=368)
        self.chain([end for end in written if end[0].key == action or end[0].key == asked.key], counted)
        return [*(end for end in written if end[0].key not in (action, asked.key)), *self.guarded(chart, [(counted, NO)], 160, 460, (), "count_one", "writes"), (counted, YES)]

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
        """A task in hand whose log is old or that was never logged, at a stop or a session start: log where it stands. The agent taking a task in hand itself and logging it note the time; a task a plan took in hand forgets it."""
        taken = self.node(chart, NodeKind.CHECK, "task_just_taken", x=640, y=92)
        self.chain(self.also_on(chart, "tasks.updated", 640, 0), taken)
        planned = self.node(chart, NodeKind.CHECK, "follows_a_plan", x=640, y=184)
        self.line(taken, planned, YES)
        self.line(planned, self.node(chart, NodeKind.ACTION, "time_forget", "last_log", x=560, y=276), YES)
        self.line(planned, self.node(chart, NodeKind.ACTION, "time_note", "last_log", x=720, y=276), NO)
        self.guarded(chart, self.also_on(chart, "task_logs.created", 880, 0), 880, 92, (Guard("log_for_task_in_hand"),), "time_note", "last_log")
        return [*self.log_asked(chart, ends, 240), *self.log_asked(chart, self.also_on(chart, "session_started", 400, 0), 400)]

    def log_asked(self, chart: Chart, ends: list, x: int) -> list:
        """With a task in hand, a log time never noted or ten minutes old: log where it stands."""
        held = self.node(chart, NodeKind.CHECK, "task_in_hand", x=x, y=92)
        noted = self.node(chart, NodeKind.CHECK, "time_noted", "last_log", x=x, y=184)
        old = self.node(chart, NodeKind.CHECK, "time_over", "last_log 10 minutes", x=x, y=276)
        said = self.node(chart, NodeKind.ACTION, "say", LOG_OLD, x=x, y=368)
        self.chain(ends, held)
        self.line(held, noted, YES)
        self.line(noted, old, YES)
        self.line(noted, said, NO)
        self.line(old, said, YES)
        return [(held, NO), (old, NO), (said, THEN)]

    def working_at_tick(self, chart: Chart, ends: list) -> list:
        """A task in hand as the clock ticks: still open after a quiet quarter hour. Taking a task in hand and the agent's own events note when it was last active."""
        self.guarded(chart, self.also_on(chart, "tasks.updated", 1040, 0), 1040, 92, (Guard("task_just_taken"),), "time_note", "last_active")
        self.noted_on_activity(chart, "last_active", 240)
        return self.guarded(chart, ends, 400, 92, (Guard("time_over", "last_active 15 minutes"),), "say", STILL_OPEN)

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
