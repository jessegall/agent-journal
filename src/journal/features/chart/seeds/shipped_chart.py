from journal.features.chart.catalogue import Catalogue
from journal.features.chart.seeds.drawing import Drawing
from journal.features.seed import Seed
from journal.models.actor import Actor
from journal.models.chart import Chart
from journal.models.node import Node
from journal.models.node_kind import NodeKind
from journal.repositories.charts import NO, THEN, YES, Charts
from journal.repositories.settings import Settings

STATE_TITLES = {"idle": "Idle", "working": "Working", "following_plan": "Following a plan", "awaiting": "Awaiting a worker", "waiting": "Waiting on a question", "expecting": "Expecting something outside", "stuck": "Stuck", "running_sequence": "Running a sequence"}
"""The states the page lists, in order, each with its words; following a plan has no workflows of its own shipped, it uses Working's."""
SHIPPED_STATES = ("idle", "working", "awaiting", "waiting", "expecting", "stuck", "running_sequence")
"""The states the journal ships workflows for."""
SHARED_EVENTS = ("idle", "session_started", "prompt_submitted", "tool_starting", "messages.created")
"""The events every state's workflows carry the shared conduct on: the inbox and the answers owed."""
EVENT_ORDER = ("idle", "session_started", "prompt_submitted", "tool_starting", "ticked", "messages.created", "workers.updated", "questions.updated")
"""The order a state's workflows are made and listed in: the stop first, so the first workflow of all is Idle at Agent stops."""
KEPT = " (kept from the older shape)"
DRAWINGS_VERSION = 5
"""Raised when a shipped drawing changes, so an unedited shipped workflow is redrawn at the next boot."""
DRAWINGS_VERSION_KEY = "chart.drawings_version"
"""What a retired per-event workflow with the user's edits is called: its triggers gone, its edits kept to be drawn into a state's workflow."""

NEW_MESSAGE = "[messages.new] new message {{row}}"
ONE_UNREAD = "[messages.new] new message {{unread_numbers}}"
SOME_UNREAD = "[messages.some] new messages {{unread_numbers}}"
MANY_UNREAD = "[messages.many] {{unread_count}} messages unread: journal message unread"
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
    """The workflows the journal ships, one per state per trigger, each carrying the shared conduct of its event as well as the state's own: made at boot where absent, redrawn when unedited and the shipped drawing is newer, and left alone when the user edited it. Workflows of the older shapes, bound to one event with no state or to a state with no event, retire at boot."""

    def __init__(self, charts: Charts, catalogue: Catalogue, settings: Settings) -> None:
        self.charts, self.catalogue, self.settings = charts, catalogue, settings
        own = {
            ("idle", "idle"): self.idle_at_stop,
            ("idle", "ticked"): self.idle_at_tick,
            ("working", "tool_starting"): self.working_at_tool,
            ("working", "idle"): self.working_carries_on,
            ("working", "session_started"): self.working_carries_on,
            ("working", "ticked"): self.working_at_tick,
            ("awaiting", "workers.updated"): self.awaiting_at_worker,
            ("waiting", "questions.updated"): self.waiting_at_question,
            ("expecting", "ticked"): self.expecting_at_tick,
            ("expecting", "tool_starting"): self.working_again,
            ("stuck", "tool_starting"): self.working_again,
            ("running_sequence", "idle"): self.sequence_at_stop,
        }
        shared = {"session_started": self.shared_inbox, "prompt_submitted": self.shared_inbox, "idle": self.shared_inbox, "tool_starting": self.shared_at_tool, "messages.created": self.shared_at_message}
        self.drawings: dict[tuple[str, str], Drawing] = {}
        for state in SHIPPED_STATES:
            events = sorted({e for st, e in own if st == state} | set(SHARED_EVENTS), key=EVENT_ORDER.index)
            for event in events:
                self.drawings[(state, event)] = Drawing(self.title_of(state, event), self.composed(own.get((state, event)), shared.get(event)))
        """One drawing per state per trigger: the state's own branch first, the shared branch of the event beside it."""

    def title_of(self, state: str, event: str) -> str:
        return f"{STATE_TITLES[state]} at {self.catalogue.entry(NodeKind.TRIGGER, event).title}"

    @staticmethod
    def composed(own, shared):
        def draw(chart: Chart) -> None:
            if own:
                own(chart)
            if shared:
                shared(chart)
        return draw

    def run(self) -> None:
        by = Actor.system()
        self.retire_the_older_shape(by)
        self.retire_unpaired(by)
        self.stop_what_names_an_unknown_entry(by)
        for (state, event), drawing in self.drawings.items():
            standing = self.charts.for_pair(state, event)
            if standing is None:
                drawing.draw(self.charts.save(Chart(title=drawing.title, shipped=True, state=state, event=event), by))
            elif self.outdated(standing):
                self.reset(standing, by)
        self.settings.set(DRAWINGS_VERSION_KEY, DRAWINGS_VERSION, by)

    def outdated(self, chart: Chart) -> bool:
        """An unedited shipped workflow drawn by an older shipping is redrawn; one the user edited is theirs and stays."""
        return int(self.settings.project(DRAWINGS_VERSION_KEY, 0) or 0) < DRAWINGS_VERSION and all(n.shipped for n in self.charts.nodes_of(chart))

    def retire_unpaired(self, by: Actor) -> None:
        """A workflow bound to a state but no event, the shape before one per state per trigger, goes: whole when unedited, else kept as the user's own without its triggers."""
        for chart in [c for c in self.charts.all() if c.state and not c.event]:
            self.retire(chart, by)

    def retire_the_older_shape(self, by: Actor) -> None:
        """A shipped workflow bound to one event and no state, the oldest shape, goes the same way."""
        for chart in [c for c in self.charts.shipped() if not c.state]:
            self.retire(chart, by)

    def retire(self, chart: Chart, by: Actor) -> None:
        nodes = self.charts.nodes_of(chart)
        if all(node.shipped for node in nodes):
            self.charts.remove(chart, by)
            return
        for node in [n for n in nodes if n.kind == NodeKind.TRIGGER]:
            self.charts.remove_node(node, by)
        self.charts.save(chart.with_(shipped=False, state="", event="", title=chart.title + KEPT), by)

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
        """A shipped workflow as shipped again: every node and line gone, its drawing drawn anew, one more revision."""
        drawing = self.drawings[(chart.state, chart.event)]
        for node in self.charts.nodes_of(chart):
            self.charts.remove_node(node, by)
        drawing.draw(chart)
        return self.charts.save(chart.saved_again().with_(title=drawing.title), by)

    def node(self, chart: Chart, kind: NodeKind, key: str, text: str = "", x: int = 0, y: int = 0) -> Node:
        return self.charts.add_node(chart, Node(kind=kind, key=key, text=text, x=x, y=y, shipped=True), Actor.system())

    def trigger(self, chart: Chart) -> Node:
        """The workflow's one trigger, the event it is for, made where it is not yet: the state's own branch and the shared one hang off the same trigger."""
        standing = next((n for n in self.charts.nodes_of(chart) if n.kind == NodeKind.TRIGGER), None)
        return standing or self.node(chart, NodeKind.TRIGGER, chart.event, x=400, y=0)

    def line(self, source: Node, target: Node, port: str) -> None:
        self.charts.connect(source, target, port, Actor.system())

    def shared_at_message(self, chart: Chart) -> None:
        """A message the user leaves is named by number, typed into the terminal."""
        arrives = self.trigger(chart)
        by_user = self.node(chart, NodeKind.CHECK, "message_by_user", x=400, y=92)
        named = self.node(chart, NodeKind.ACTION, "type", NEW_MESSAGE, x=400, y=184)
        self.line(arrives, by_user, THEN)
        self.line(by_user, named, YES)

    def shared_inbox(self, chart: Chart) -> None:
        """The inbox named at a start, a prompt and a stop."""
        self.draw_inbox(chart, self.trigger(chart), x=720, y=92)

    def shared_at_tool(self, chart: Chart) -> None:
        """At a tool use the inbox is named every few uses and the write held after enough namings; a read message is answered before the next tool, held after enough uses."""
        left = 720
        tool = self.trigger(chart)
        unread = self.node(chart, NodeKind.CHECK, "unread_messages", x=left + 80, y=92)
        reminders = self.node(chart, NodeKind.CHECK, "unread_reminders_over", "messages.hold_after_reminders", x=left + 80, y=184)
        writes = self.node(chart, NodeKind.CHECK, "tool_writes", x=left, y=276)
        hold_unread = self.node(chart, NodeKind.ACTION, "hold", UNREAD_HELD, x=left, y=368)
        every = self.node(chart, NodeKind.CHECK, "tool_uses_since_unread_every", "messages.remind_every", x=left + 160, y=368)
        self.line(tool, unread, THEN)
        self.line(unread, reminders, YES)
        self.line(reminders, writes, YES)
        self.line(writes, hold_unread, YES)
        self.line(writes, every, NO)
        self.line(reminders, every, NO)
        self.draw_inbox(chart, every, x=left + 160, y=460)
        owed = self.node(chart, NodeKind.CHECK, "unanswered_messages", x=left + 400, y=92)
        journal = self.node(chart, NodeKind.CHECK, "journal_command", x=left + 400, y=184)
        theirs = self.node(chart, NodeKind.CHECK, "tool_reads_their_files", x=left + 400, y=276)
        held_after = self.node(chart, NodeKind.CHECK, "tool_uses_since_read_over", "messages.hold_after", x=left + 400, y=368)
        hold_owed = self.node(chart, NodeKind.ACTION, "hold", ANSWER_HELD, x=left + 320, y=460)
        ask_after = self.node(chart, NodeKind.CHECK, "tool_uses_since_read_over", "messages.nudge_after", x=left + 480, y=460)
        say_owed = self.node(chart, NodeKind.ACTION, "say", ANSWER, x=left + 480, y=552)
        self.line(tool, owed, THEN)
        self.line(owed, journal, YES)
        self.line(journal, theirs, NO)
        self.line(theirs, held_after, NO)
        self.line(held_after, hold_owed, YES)
        self.line(held_after, ask_after, NO)
        self.line(ask_after, say_owed, YES)

    def draw_inbox(self, chart: Chart, after: Node, x: int, y: int) -> None:
        """What waits unread, named from the node given: one message by its number, a few by theirs, more than three by their count."""
        unread = self.node(chart, NodeKind.CHECK, "unread_messages", x=x, y=y)
        many = self.node(chart, NodeKind.CHECK, "unread_over", "4", x=x, y=y + 92)
        say_many = self.node(chart, NodeKind.ACTION, "say", MANY_UNREAD, x=x - 160, y=y + 184)
        some = self.node(chart, NodeKind.CHECK, "unread_over", "2", x=x, y=y + 184)
        say_some = self.node(chart, NodeKind.ACTION, "say", SOME_UNREAD, x=x - 160, y=y + 276)
        say_one = self.node(chart, NodeKind.ACTION, "say", ONE_UNREAD, x=x, y=y + 276)
        self.line(after, unread, THEN if after.kind != NodeKind.CHECK else YES)
        self.line(unread, many, YES)
        self.line(many, say_many, YES)
        self.line(many, some, NO)
        self.line(some, say_some, YES)
        self.line(some, say_one, NO)

    def idle_at_stop(self, chart: Chart) -> None:
        """An agent at rest stopping: parked tasks hold it in any mode and in auto mode the next open task holds it; a plan at a checkpoint waits for the user's look, or in auto mode holds the stop and carries on."""
        stop = self.trigger(chart)
        parked = self.node(chart, NodeKind.CHECK, "parked_tasks", x=160, y=92)
        say_parked = self.node(chart, NodeKind.ACTION, "block_stop", PARKED, x=0, y=184)
        auto = self.node(chart, NodeKind.CHECK, "auto_mode", x=160, y=276)
        open_ = self.node(chart, NodeKind.CHECK, "open_tasks", x=160, y=368)
        hold_stop = self.node(chart, NodeKind.ACTION, "block_stop", NEXT, x=160, y=460)
        self.line(stop, parked, THEN)
        self.line(parked, say_parked, YES)
        self.line(parked, auto, NO)
        self.line(auto, open_, YES)
        self.line(open_, hold_stop, YES)
        checkpoint = self.node(chart, NodeKind.CHECK, "plan_at_checkpoint", x=400, y=92)
        auto_at_checkpoint = self.node(chart, NodeKind.CHECK, "auto_mode", x=400, y=184)
        passed = self.node(chart, NodeKind.ACTION, "block_stop", CHECKPOINT_PASSED, x=320, y=276)
        looks = self.node(chart, NodeKind.ACTION, "say", CHECKPOINT, x=480, y=276)
        self.line(stop, checkpoint, THEN)
        self.line(checkpoint, auto_at_checkpoint, YES)
        self.line(auto_at_checkpoint, passed, YES)
        self.line(auto_at_checkpoint, looks, NO)

    def idle_at_tick(self, chart: Chart) -> None:
        """As the clock ticks on an agent at rest: the parked ask after a minute and the check-in after half an hour."""
        tick = self.trigger(chart)
        parked_tick = self.node(chart, NodeKind.CHECK, "parked_tasks", x=240, y=92)
        quiet_a_minute = self.node(chart, NodeKind.CHECK, "quiet_for_over", "60", x=240, y=184)
        ask_parked = self.node(chart, NodeKind.ACTION, "type", PARKED_STILL, x=240, y=276)
        auto_tick = self.node(chart, NodeKind.CHECK, "auto_mode", x=560, y=92)
        quiet_half_an_hour = self.node(chart, NodeKind.CHECK, "quiet_for_over", "1800", x=560, y=184)
        check_in = self.node(chart, NodeKind.ACTION, "type", CHECK_IN, x=560, y=276)
        self.line(tick, parked_tick, THEN)
        self.line(parked_tick, quiet_a_minute, YES)
        self.line(quiet_a_minute, ask_parked, YES)
        self.line(tick, auto_tick, THEN)
        self.line(auto_tick, quiet_half_an_hour, YES)
        self.line(quiet_half_an_hour, check_in, YES)

    def working_at_tool(self, chart: Chart) -> None:
        """A task in hand at a tool use that writes: the task is named every so many edits, the log asked for at the first threshold and the write held when the log is overdue."""
        tool = self.trigger(chart)
        writes = self.node(chart, NodeKind.CHECK, "tool_writes", x=160, y=92)
        overdue = self.node(chart, NodeKind.CHECK, "edits_since_log_over", "tasks.log_after", x=160, y=184)
        hold_log = self.node(chart, NodeKind.ACTION, "hold", LOG_OVERDUE, x=0, y=276)
        first = self.node(chart, NodeKind.CHECK, "edits_since_log_at", "tasks.first_nudge_after", x=240, y=276)
        say_soon = self.node(chart, NodeKind.ACTION, "say", LOG_SOON, x=160, y=368)
        named = self.node(chart, NodeKind.CHECK, "edits_since_log_every", "tasks.name_every", x=320, y=368)
        say_in_hand = self.node(chart, NodeKind.ACTION, "say", IN_HAND, x=320, y=460)
        self.line(tool, writes, THEN)
        self.line(writes, overdue, YES)
        self.line(overdue, hold_log, YES)
        self.line(overdue, first, NO)
        self.line(first, say_soon, YES)
        self.line(first, named, NO)
        self.line(named, say_in_hand, YES)

    def working_carries_on(self, chart: Chart) -> None:
        """A task in hand at a stop or a session start: carry on, with the log asked for when it is stale."""
        trigger = self.trigger(chart)
        stale = self.node(chart, NodeKind.CHECK, "log_stale_over", "600", x=240, y=92)
        carry_on_log = self.node(chart, NodeKind.ACTION, "say", CARRY_ON_LOG, x=160, y=184)
        carry_on = self.node(chart, NodeKind.ACTION, "say", CARRY_ON, x=320, y=184)
        self.line(trigger, stale, THEN)
        self.line(stale, carry_on_log, YES)
        self.line(stale, carry_on, NO)

    def working_at_tick(self, chart: Chart) -> None:
        """A task in hand as the clock ticks: still open after a quiet quarter hour."""
        tick = self.trigger(chart)
        quiet = self.node(chart, NodeKind.CHECK, "quiet_for_over", "900", x=400, y=92)
        still_open = self.node(chart, NodeKind.ACTION, "say", STILL_OPEN, x=400, y=184)
        self.line(tick, quiet, THEN)
        self.line(quiet, still_open, YES)

    def awaiting_at_worker(self, chart: Chart) -> None:
        """An agent awaiting workers: one reporting or stopping is told, and the agent goes back to its work when its last worker is back."""
        worker = self.trigger(chart)
        for column, came, told in ((240, "worker_reported", REPORTED), (560, "worker_stopped", STOPPED)):
            now = self.node(chart, NodeKind.CHECK, came, x=column, y=92)
            awaited = self.node(chart, NodeKind.CHECK, "agent_awaits_the_worker", x=column, y=184)
            tell = self.node(chart, NodeKind.ACTION, "type", told, x=column, y=276)
            last = self.node(chart, NodeKind.CHECK, "last_worker_back", x=column, y=368)
            back = self.node(chart, NodeKind.ACTION, "release", RETURNED, x=column, y=460)
            self.line(worker, now, THEN)
            self.line(now, awaited, YES)
            self.line(awaited, tell, YES)
            self.line(tell, last, THEN)
            self.line(last, back, YES)

    def waiting_at_question(self, chart: Chart) -> None:
        """An agent waiting on a question: when it is answered the agent goes back to its work, told how to read the answer."""
        question = self.trigger(chart)
        answered = self.node(chart, NodeKind.CHECK, "question_answered", x=400, y=92)
        waits = self.node(chart, NodeKind.CHECK, "agent_waits_on_the_question", x=400, y=184)
        back = self.node(chart, NodeKind.ACTION, "release", ANSWERED, x=400, y=276)
        self.line(question, answered, THEN)
        self.line(answered, waits, YES)
        self.line(waits, back, YES)

    def expecting_at_tick(self, chart: Chart) -> None:
        """An agent awaiting something outside: after five quiet minutes it is told to check it, with what it awaits and how long."""
        tick = self.trigger(chart)
        quiet = self.node(chart, NodeKind.CHECK, "quiet_for_over", "300", x=400, y=92)
        check = self.node(chart, NodeKind.ACTION, "say", CHECK_AWAITED, x=400, y=184)
        self.line(tick, quiet, THEN)
        self.line(quiet, check, YES)

    def working_again(self, chart: Chart) -> None:
        """The agent's own tool use ends a wait on something outside: the wait is released, with no line."""
        tool = self.trigger(chart)
        own = self.node(chart, NodeKind.CHECK, "own_tool", x=160, y=92)
        back = self.node(chart, NodeKind.ACTION, "release", x=160, y=184)
        self.line(tool, own, THEN)
        self.line(own, back, YES)

    def sequence_at_stop(self, chart: Chart) -> None:
        """An agent working through a sequence: a stop is told the step in hand; stepping on is the state's move."""
        stop = self.trigger(chart)
        step = self.node(chart, NodeKind.ACTION, "say", STEP, x=400, y=92)
        self.line(stop, step, THEN)
