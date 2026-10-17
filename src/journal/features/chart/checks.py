import re
from datetime import datetime, timedelta, timezone
import time
from journal.config import Config
from journal.engine.machine import Machine
from journal.events.agent.idle import Idle
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_starting import ToolStarting
from journal.events.models.model_event import ModelEvent
from journal.events.models.created import Created
from journal.events.models.updated import Updated
from journal.features.chart.context import Context
from journal.features.registry import Registry
from journal.features.skills.requiring import Requiring
from journal.features.shell.chain import Chain
from journal.features.tasks.states.working import Working
from journal.features.questions.states.waiting import Waiting
from journal.features.workers.states.awaiting import Awaiting
from journal.models.author import Author
from journal.models.message import Message
from journal.models.question import Question
from journal.models.task import Task
from journal.models.task_log import TaskLog
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.workers import Workers
from journal.models.plan_state import PlanState
from journal.models.task_state import TaskState
from journal.providers.providers import Providers
from journal.repositories.entries import Entries
from journal.repositories.messages import Messages
from journal.repositories.not_found import NotFound
from journal.repositories.plans import Plans
from journal.repositories.counts import Counts
from journal.repositories.settings import Settings
from journal.repositories.rules import Rules
from journal.repositories.facts import Facts
from journal.repositories.reminders import Reminders
from journal.repositories.agents import Agents
from journal.repositories.questions import Questions
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks


UNITS = re.compile(r"^(\d+)\s*(s|sec|secs|second|seconds|m|min|mins|minute|minutes|h|hr|hrs|hour|hours)?$")
SECONDS = {"s": 1, "sec": 1, "secs": 1, "second": 1, "seconds": 1, "m": 60, "min": 60, "mins": 60, "minute": 60, "minutes": 60, "h": 3600, "hr": 3600, "hrs": 3600, "hour": 3600, "hours": 3600}
"""A time in a check's text, by its unit; a bare number is seconds."""
TAKEN_OVER_WITHIN = timedelta(days=1)
"""Another session that worked here this recently makes a start a takeover."""
COUNTERS = ("unanswered_over", "quiet_for_over", "unread_over", "log_stale_over", "context_over")
WORD_CHECKS = ("tool_named", "tool_input_has", "prompt_has", "time_between")
"""The checks that read their text as words: the tool names, the words looked for, the hours."""
"""The checks that take a number: the node's text, or the setting named there."""
COUNT_CHECKS = ("count_over", "count_at", "count_every")
"""The checks on a count the workflow keeps: the text names the count, then the number or the setting."""


class Checks:
    """The catalogue's checks answered from the rows: one method per key, named after it. A counter check takes the node's text as its number, or the name of the setting that holds it."""

    def __init__(self, tasks: Tasks, plans: Plans, messages: Messages, settings: Settings, machine: Machine, providers: Providers, entries: Entries, registry: Registry, config: Config, workers: Workers, counts: Counts, requiring: Requiring,
                 rules: Rules, facts: Facts, reminders: Reminders, agents: Agents, questions: Questions, task_logs: TaskLogs) -> None:
        self.tasks, self.plans, self.messages, self.settings, self.machine, self.providers, self.entries = tasks, plans, messages, settings, machine, providers, entries
        self.registry, self.config, self.workers = registry, config, workers
        self.counts = counts
        self.rules, self.facts, self.reminders, self.agents, self.questions = rules, facts, reminders, agents, questions
        self.task_logs = task_logs
        self.requiring = requiring

    def answer(self, key: str, ctx: Context, text: str = "") -> bool:
        check = getattr(self, key)
        if key in COUNT_CHECKS:
            name, _, limit = text.strip().partition(" ")
            return bool(check(ctx, name, self.number(limit)))
        if key in COUNTERS:
            return bool(check(ctx, self.number(text)))
        return bool(check(ctx, text.strip()) if key in WORD_CHECKS else check(ctx))

    def count_of(self, ctx: Context, name: str) -> int:
        """The agent's count by that name: edits, uses, owed and namings are read from the journal's own record, so no workflow keeps them for another; any other name is a count a workflow started."""
        if not ctx.session:
            return 0
        derived = getattr(self, f"derived_{name}", None)
        return derived(ctx) if derived else self.counts.named(ctx.session, name).value

    def derived_edits(self, ctx: Context) -> int:
        """Writes since the task in hand was last logged, or started, a held one not counted; at a write, the ones before it, so the write in hand is read against the edits so far."""
        state = ctx.state
        if not isinstance(state, Working):
            return 0
        task = self.tasks.find(state.task_id)
        logs = self.task_logs.of(task)
        since = max([t for t in (task.started_at, *(log.created_at for log in logs)) if t], default=None)
        provider = self.providers.named(ctx.provider)
        before_this = self.tool_uses_since(ctx.session, since)[1:] if isinstance(ctx.event, ToolStarting) else self.tool_uses_since(ctx.session, since)
        return sum(1 for e in before_this if not e.data.get("refused") and provider.writes(e.data.get("tool_name", ""), e.data.get("tool_input", {}) or {}))

    def derived_uses(self, ctx: Context) -> int:
        """Tool uses since the newest unread message came."""
        unread = self.messages.unread()
        return len(self.tool_uses_since(ctx.session, max(m.created_at for m in unread))) if unread else 0

    def derived_owed(self, ctx: Context) -> int:
        """Tool uses since the first message read and left unanswered was read."""
        unanswered = [m for m in self.messages.unanswered() if m.read_at]
        return len(self.tool_uses_since(ctx.session, min(m.read_at for m in unanswered))) if unanswered else 0

    def derived_namings(self, ctx: Context) -> int:
        """The reminders of the unread messages the agent has had: its tool uses since the newest one came, by the reminder interval; read from the record, so no workflow's lines change it."""
        every = self.number("messages.remind_every")
        return self.derived_uses(ctx) // every if every else 0

    def tool_uses_since(self, session: str, since) -> list:
        """The agent's own tool uses since the moment, newest first: a subagent's share the session and are not counted."""
        return [e for e in self.entries.tool_starts(session) if not (e.data.get("agent_id") or e.data.get("subagent_id")) and (since is None or (e.created_at and e.created_at > since))]

    def count_over(self, ctx: Context, name: str, limit: int) -> bool:
        """The agent's count by that name has reached the number."""
        return bool(ctx.session) and self.count_of(ctx, name) >= limit

    def count_at(self, ctx: Context, name: str, limit: int) -> bool:
        return bool(ctx.session) and self.count_of(ctx, name) == limit

    def count_every(self, ctx: Context, name: str, limit: int) -> bool:
        """The count stands at a multiple of the number, and not at nought: every Nth time, so a cadence reads one check."""
        value = self.count_of(ctx, name)
        return limit > 0 and value > 0 and value % limit == 0

    def number(self, text: str) -> int:
        """The node's text as a number, with a unit of time when it has one (30 seconds, 10 minutes, 2 hours; a bare number is seconds), or the setting it names, read through its option so an unset key means the option's default, or nothing."""
        timed = UNITS.match(text.strip().lower())
        if timed:
            return int(timed.group(1)) * SECONDS[timed.group(2) or "s"]
        option = next((o for o in self.registry.options() if o.key == text.strip()), None)
        if option:
            return int(self.settings.option(option))
        return int(self.settings.project(text.strip(), 0)) if text.strip() else 0

    def log_stale_over(self, ctx: Context, seconds: int) -> bool:
        """The task in hand was last logged longer ago than so many seconds, or never."""
        state = self.state(ctx)
        return isinstance(state, Working) and (not state.logged_at or time.time() - state.logged_at > seconds)

    def open_tasks(self, ctx: Context) -> bool:
        return bool(self.plans.free())

    def plan_at_checkpoint(self, ctx: Context) -> bool:
        """A started plan here stands at a completed checkpoint phase, its next phase not begun."""
        return any(self.plans.at_checkpoint(p) for p in self.plans.in_() if p.state == PlanState.STARTED)

    def task_in_hand(self, ctx: Context) -> bool:
        state = self.state(ctx)
        return isinstance(state, Working) and bool(state.task_id)

    def parked_tasks(self, ctx: Context) -> bool:
        return bool(self.tasks.in_state(TaskState.PARKED))

    def blocked_tasks(self, ctx: Context) -> bool:
        return bool(self.tasks.in_state(TaskState.BLOCKED))

    def tool_named(self, ctx: Context, names: str) -> bool:
        """The tool about to run is one of the names in the text, as the provider names it, in any case."""
        wanted = {n.strip().lower() for n in names.replace(",", " ").split() if n.strip()}
        return isinstance(ctx.event, ToolStarting) and ctx.event.tool.lower() in wanted

    def tool_input_has(self, ctx: Context, words: str) -> bool:
        """The tool's input, any of its text, holds the words, in any case: a file path, a command, a prompt to a subagent."""
        if not isinstance(ctx.event, ToolStarting) or not words:
            return False
        return words.lower() in " ".join(self.texts_in(ctx.event.input)).lower()

    @classmethod
    def texts_in(cls, value) -> list[str]:
        if isinstance(value, str):
            return [value]
        if isinstance(value, dict):
            return [t for v in value.values() for t in cls.texts_in(v)]
        if isinstance(value, (list, tuple)):
            return [t for v in value for t in cls.texts_in(v)]
        return []

    def prompt_has(self, ctx: Context, words: str) -> bool:
        """The prompt the user sent holds the words, in any case."""
        return isinstance(ctx.event, PromptSubmitted) and bool(words) and words.lower() in ctx.event.prompt.lower()

    def context_over(self, ctx: Context, percent: int) -> bool:
        """The agent's context window is fuller than so many percent, as the event reports it."""
        context = getattr(ctx.event, "context", None)
        return context is not None and context * 100 > percent

    def time_between(self, ctx: Context, hours: str) -> bool:
        """The local time of day falls within the span in the text, HH:MM-HH:MM, a span past midnight included; a tick's own time, else now."""
        start, _, end = hours.replace(" ", "").partition("-")
        try:
            a = int(start[:2]) * 60 + int(start[3:5] or 0)
            b = int(end[:2]) * 60 + int(end[3:5] or 0)
        except ValueError:
            return False
        at = ctx.event.at if isinstance(ctx.event, Ticked) and ctx.event.at else time.time()
        local = time.localtime(at)
        now = local.tm_hour * 60 + local.tm_min
        return a <= now < b if a <= b else now >= a or now < b

    def quiet_for_over(self, ctx: Context, seconds: int) -> bool:
        """The clock ticks and the agent has been quiet for at least so many seconds."""
        return isinstance(ctx.event, Ticked) and ctx.event.quiet_for >= seconds

    def worker_reported(self, ctx: Context) -> bool:
        return self.worker_now(ctx, WorkerState.REPORTED)

    def worker_stopped(self, ctx: Context) -> bool:
        return self.worker_now(ctx, WorkerState.STOPPED)

    def worker_now(self, ctx: Context, state: WorkerState) -> bool:
        """The row event is a worker that just came to this state, not one saved again in it."""
        event = ctx.event
        return isinstance(event, Updated) and isinstance(event.model, Worker) and event.model.state == state and event.was is not None and event.was.state != state

    def agent_awaits_the_worker(self, ctx: Context) -> bool:
        state = self.state(ctx)
        return isinstance(ctx.event, ModelEvent) and isinstance(ctx.event.model, Worker) and isinstance(state, Awaiting) and ctx.event.model.id in state.workers

    def last_worker_back(self, ctx: Context) -> bool:
        """Every worker the agent awaits has reported or stopped, the one of this row as the row now says."""
        state = self.state(ctx)
        if not isinstance(state, Awaiting):
            return False
        row = ctx.event.model if isinstance(ctx.event, ModelEvent) and isinstance(ctx.event.model, Worker) else None
        return all((row.state if row and row.id == n else self.workers.find(n).state) != WorkerState.DISPATCHED for n in state.workers)

    def question_answered(self, ctx: Context) -> bool:
        event = ctx.event
        return isinstance(event, Updated) and isinstance(event.model, Question) and event.model.answer is not None and event.was is not None and event.was.answer is None

    def agent_waits_on_the_question(self, ctx: Context) -> bool:
        state = self.state(ctx)
        return isinstance(ctx.event, ModelEvent) and isinstance(ctx.event.model, Question) and isinstance(state, Waiting) and state.question_id == ctx.event.model.id

    def taken_over(self, ctx: Context) -> bool:
        """Another session worked this environment within a day, and this start is not the same session going on after a compaction."""
        event = ctx.event
        if not isinstance(event, SessionStarted) or event.source == "compact":
            return False
        return bool(self.agents.others_lately(event.session, datetime.now(timezone.utc) - TAKEN_OVER_WITHIN))

    def after_compaction(self, ctx: Context) -> bool:
        """The start is the same session going on after its context was compacted."""
        return isinstance(ctx.event, SessionStarted) and ctx.event.source == "compact"

    def has_rules(self, ctx: Context) -> bool:
        return bool(self.rules.all())

    def has_facts(self, ctx: Context) -> bool:
        return bool(self.facts.in_())

    def has_reminders(self, ctx: Context) -> bool:
        return bool(self.reminders.in_())

    def something_waiting(self, ctx: Context) -> bool:
        """Open tasks, unread messages or open questions wait for the agent."""
        return bool(self.tasks.in_state(TaskState.OPEN) or self.messages.unread() or self.questions.open())

    def prompt_names_skill(self, ctx: Context) -> bool:
        """The prompt names a keyword of a skill."""
        return isinstance(ctx.event, PromptSubmitted) and bool(self.requiring.named_in(ctx.event.prompt))

    def context_over_mark(self, ctx: Context) -> bool:
        """The context window crossed a mark the agent has not been asked at."""
        return bool(ctx.session) and bool(self.marks_due(ctx))

    def marks_due(self, ctx: Context) -> list[int]:
        from journal.features.memory.feature import Memory
        context = getattr(ctx.event, "context", None)
        if context is None or not ctx.session:
            return []
        taken = self.machine.agent(ctx.session, ctx.environment_id).context_mark
        return [mark for mark in Memory.MARKS if context * 100 >= mark > taken]

    def something_owed(self, ctx: Context) -> bool:
        """The agent owes the journal a skill's read, the look at what is in flight or a decision at a mark."""
        return self.not_oriented(ctx) or self.skill_owed(ctx) or self.mark_owed(ctx)

    def mark_owed(self, ctx: Context) -> bool:
        """The agent crossed a mark and has not decided what survives it."""
        return bool(ctx.session) and bool(self.machine.agent(ctx.session, ctx.environment_id).mark_owed)

    def not_oriented(self, ctx: Context) -> bool:
        """The agent has not looked at what is in flight here since its session started."""
        return bool(ctx.session) and not self.machine.agent(ctx.session, ctx.environment_id).oriented

    def skill_owed(self, ctx: Context) -> bool:
        """The agent owes a read of a skill's file."""
        return bool(ctx.session) and bool(self.requiring.owed_names(self.machine.agent(ctx.session, ctx.environment_id)))

    def message_by_user(self, ctx: Context) -> bool:
        """The row event is a message the user wrote."""
        return isinstance(ctx.event, ModelEvent) and isinstance(ctx.event.model, Message) and ctx.event.model.author == Author.USER

    def tool_reads_their_files(self, ctx: Context) -> bool:
        """The tool about to run reads a file attached to a message read and left unanswered: part of reading it, not work."""
        if not isinstance(ctx.event, ToolStarting):
            return False
        path = self.providers.named(ctx.provider).read_path(ctx.event.tool, ctx.event.input)
        return bool(path) and any(path.startswith(str(self.config.home / "files" / "message" / str(m.id)) + "/") for m in self.messages.unanswered())

    def unread_messages(self, ctx: Context) -> bool:
        return bool(self.messages.unread())

    def unread_over(self, ctx: Context, n: int) -> bool:
        """At least so many messages unread: the inbox line is chosen by the count."""
        return len(self.messages.unread()) >= n

    def unanswered_messages(self, ctx: Context) -> bool:
        return bool(self.messages.unanswered())

    def unanswered_over(self, ctx: Context, n: int) -> bool:
        """At least so many messages read and not answered."""
        return len(self.messages.unanswered()) >= n

    def message_just_read(self, ctx: Context) -> bool:
        """The row event is a message this write marked read."""
        event = ctx.event
        return isinstance(event, Updated) and isinstance(event.model, Message) and event.model.read_at is not None and event.was is not None and event.was.read_at is None

    def task_just_started(self, ctx: Context) -> bool:
        """The row event is a task this write started, by the agent whose walk this is."""
        event = ctx.event
        return isinstance(event, Updated) and isinstance(event.model, Task) and event.model.started_at is not None and event.was is not None and event.was.started_at is None and event.by.id == ctx.session

    def log_for_task_in_hand(self, ctx: Context) -> bool:
        """The row event is a log line of the task the agent has in hand."""
        event, state = ctx.event, self.state(ctx)
        return isinstance(event, Created) and isinstance(event.model, TaskLog) and isinstance(state, Working) and event.model.task_id == state.task_id

    def auto_mode(self, ctx: Context) -> bool:
        from journal.features.tasks.feature import Tasks
        return bool(self.settings.option(Tasks.AUTO))

    def own_tool(self, ctx: Context) -> bool:
        """The tool use is the agent's own, not a subagent's: a subagent's reads and writes are not the agent working again."""
        return isinstance(ctx.event, ToolStarting) and not ctx.event.subagent

    def tool_writes(self, ctx: Context) -> bool:
        event = ctx.event
        return isinstance(event, ToolStarting) and self.providers.named(ctx.provider).writes(event.tool, event.input)

    def journal_command(self, ctx: Context) -> bool:
        event = ctx.event
        if not isinstance(event, ToolStarting) or event.tool != self.providers.named(ctx.provider).shell_tool:
            return False
        journal, parts = Chain.journal_parts(event.input.get("command", ""))
        return parts > 0 and journal == parts

    def state(self, ctx: Context):
        """The agent's state as the walk read it once."""
        return ctx.state
