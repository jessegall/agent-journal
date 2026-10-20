import re
from datetime import datetime, timedelta, timezone
import time
from journal.features.plans.states.following_plan import FollowingPlan
from journal.config import Config
from journal.engine.machine import Machine
from journal.events.agent.idle import Idle
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.line_said import LineSaid
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.tool_starting import ToolStarting
from journal.events.models.model_event import ModelEvent
from journal.events.models.created import Created
from journal.events.models.updated import Updated
from journal.support.version_3_backup import Version3Backup
from journal.features.chart.support.context import Context
from journal.features.registry import Registry
from journal.support.requiring import Requiring
from journal.support.chain import Chain
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
from journal.support.not_found import NotFound
from journal.repositories.plans import Plans
from journal.repositories.counts import Counts
from journal.repositories.noted_times import NotedTimes
from journal.engine.clock import Clock
from journal.repositories.settings import Settings
from journal.repositories.rules import Rules
from journal.repositories.facts import Facts
from journal.repositories.reminders import Reminders
from journal.repositories.agents import Agents
from journal.repositories.questions import Questions
from journal.repositories.task_logs import TaskLogs
from journal.repositories.command_outputs import CommandOutputs
from journal.repositories.tasks import Tasks


UNITS = re.compile(r"^(\d+)\s*(s|sec|secs|second|seconds|m|min|mins|minute|minutes|h|hr|hrs|hour|hours)?$")
SECONDS = {"s": 1, "sec": 1, "secs": 1, "second": 1, "seconds": 1, "m": 60, "min": 60, "mins": 60, "minute": 60, "minutes": 60, "h": 3600, "hr": 3600, "hrs": 3600, "hour": 3600, "hours": 3600}
"""A time in a check's text, by its unit; a bare number is seconds."""
TAKEN_OVER_WITHIN = timedelta(days=1)
"""Another session that worked here this recently makes a start a takeover."""
COUNTERS = ("unanswered_over", "unread_over", "context_over", "memory_older_than", "background_running")
WORD_CHECKS = ("tool_named", "tool_input_has", "prompt_has", "time_between", "line_is")
"""The checks that read their text as words: the tool names, the words looked for, the hours."""
"""The checks that take a number: the node's text, or the setting named there."""
COUNT_CHECKS = ("count_over", "count_at", "count_every", "count_wait")
"""The checks on a count the workflow keeps: the text names the count, then the number or the setting."""
COUNT_ACTIONS = ("count_start", "count_begin", "count_one")
"""The actions on a count the workflow keeps: the text names the count."""
TIME_CHECKS = ("time_over", "time_noted")
"""The checks on a time the workflow noted: the text names the time, then how long, with its unit."""
TIME_ACTIONS = ("time_note", "time_forget")
"""The actions that note a time: the text names it."""
VALUE_CHECKS = (*COUNT_CHECKS, *TIME_CHECKS)
VALUE_ACTIONS = (*COUNT_ACTIONS, *TIME_ACTIONS)
"""The steps on the values a workflow keeps in an environment, its counts and its times."""
VALUE_STEPS = (*VALUE_ACTIONS, *VALUE_CHECKS)


class Checks:
    """The catalogue's checks answered from the rows: one method per key, named after it. A counter check takes the node's text as its number, or the name of the setting that holds it."""

    def __init__(self, tasks: Tasks, plans: Plans, messages: Messages, settings: Settings, machine: Machine, providers: Providers, entries: Entries, registry: Registry, config: Config, workers: Workers, counts: Counts, requiring: Requiring,
                 rules: Rules, facts: Facts, reminders: Reminders, agents: Agents, questions: Questions, task_logs: TaskLogs, backup: Version3Backup, outputs: CommandOutputs, times: NotedTimes, clock: Clock) -> None:
        self.outputs, self.times, self.clock = outputs, times, clock
        self.tasks, self.plans, self.messages, self.settings, self.machine, self.providers, self.entries = tasks, plans, messages, settings, machine, providers, entries
        self.registry, self.config, self.workers = registry, config, workers
        self.counts = counts
        self.backup = backup
        self.rules, self.facts, self.reminders, self.agents, self.questions = rules, facts, reminders, agents, questions
        self.task_logs = task_logs
        self.requiring = requiring

    def answer(self, key: str, ctx: Context, text: str = "") -> bool:
        check = getattr(self, key)
        if key in VALUE_CHECKS:
            name, _, limit = text.strip().partition(" ")
            return bool(check(ctx, name, self.number(limit)))
        if key in COUNTERS:
            return bool(check(ctx, self.number(text)))
        return bool(check(ctx, text.strip()) if key in WORD_CHECKS else check(ctx))

    def count_of(self, ctx: Context, name: str) -> int:
        """The count by that name the workflow being walked keeps in the environment."""
        return self.counts.named(ctx.value(name)).value

    def counts_kept(self, workflow: int) -> dict[str, int]:
        """The counts a workflow keeps in the environment, by their names."""
        return self.counts.of_workflow(workflow)

    def times_kept(self, workflow: int) -> dict[str, int]:
        """The times a workflow noted in the environment, each as the seconds since, by their names."""
        now = self.clock.now()
        return {name: int(now - at) for name, at in self.times.of_workflow(workflow).items()}

    def seconds_since(self, ctx: Context, name: str) -> int | None:
        """How long ago the workflow being walked noted the time by that name, by the engine's clock; None when it never did."""
        noted = self.times.at(ctx.value(name))
        return None if noted is None else int(self.clock.now() - noted)

    def time_noted(self, ctx: Context, name: str, limit: int) -> bool:
        """The workflow noted the time by that name, and has not forgotten it since."""
        return self.seconds_since(ctx, name) is not None

    def follows_a_plan(self, ctx: Context) -> bool:
        """The agent follows a plan, which took its task in hand for it."""
        return isinstance(self.state(ctx), FollowingPlan)

    def time_over(self, ctx: Context, name: str, limit: int) -> bool:
        """At least the time given has passed since the workflow noted the time by that name; a time never noted has no since, and answers no."""
        since = self.seconds_since(ctx, name)
        return since is not None and since >= limit

    def count_over(self, ctx: Context, name: str, limit: int) -> bool:
        """The count by that name has reached the number."""
        return self.count_of(ctx, name) >= limit

    def count_wait(self, ctx: Context, name: str, limit: int) -> bool:
        """Has the count reached the number: until it has, the workflow waits here, its No needing no line."""
        return self.count_over(ctx, name, limit)

    def count_at(self, ctx: Context, name: str, limit: int) -> bool:
        return self.count_of(ctx, name) == limit

    def count_every(self, ctx: Context, name: str, limit: int) -> bool:
        """The count stands at a multiple of the number, and not at zero: every Nth time, so a cadence reads one check."""
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

    def open_tasks(self, ctx: Context) -> bool:
        return bool(self.plans.free())

    def related_tasks(self, ctx: Context) -> bool:
        return bool(self.plans.related())

    def worker_report_waiting(self, ctx: Context) -> bool:
        return bool(self.workers.reports_waiting())

    def version_3_waiting(self, ctx: Context) -> bool:
        return self.backup.is_waiting()

    def approved_plan(self, ctx: Context) -> bool:
        return bool(self.plans.approved())

    def plan_at_checkpoint(self, ctx: Context) -> bool:
        """A started plan here stands at a completed checkpoint phase, its next phase not begun."""
        return any(self.plans.at_checkpoint(p) for p in self.plans.in_() if p.state == PlanState.STARTED)

    def followed(self, ctx: Context) -> FollowingPlan | None:
        """The plan the agent follows, now or once its pause ends."""
        state = self.machine.states.underneath(self.state(ctx)) if self.state(ctx) else None
        return state if isinstance(state, FollowingPlan) else None

    def plan_moved_on(self, ctx: Context) -> bool:
        """A task just closed and the agent follows its plan at a new task: the plan moved on."""
        state = self.followed(ctx)
        task = ctx.event.model if isinstance(ctx.event, Updated) else None
        return isinstance(task, Task) and task.has_just_closed(ctx.event.was) and state is not None and state.task_id not in (0, task.id)

    def plan_left_waiting(self, ctx: Context) -> bool:
        """A task just closed and the agent follows its plan with no task to start, the plan not at a checkpoint: what is left waits."""
        state = self.followed(ctx)
        task = ctx.event.model if isinstance(ctx.event, Updated) else None
        return isinstance(task, Task) and task.has_just_closed(ctx.event.was) and state is not None and not state.task_id and not self.plans.finished(self.plans.find(state.plan_id)) and self.plans.at_checkpoint(self.plans.find(state.plan_id)) is None

    def task_in_hand(self, ctx: Context) -> bool:
        state = self.state(ctx)
        return isinstance(state, Working) and bool(state.task_id)

    def parked_tasks(self, ctx: Context) -> bool:
        return bool(self.tasks.in_state(TaskState.PARKED))

    def blocked_tasks(self, ctx: Context) -> bool:
        return bool(self.tasks.in_state(TaskState.BLOCKED))

    def blocked_outside(self, ctx: Context) -> bool:
        return bool(self.tasks.blocked_outside())

    def broken_waits(self, ctx: Context) -> bool:
        return bool(self.tasks.broken_waits())

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

    @staticmethod
    def minute_of_day(clock: str) -> int:
        """HH or HH:MM as minutes since midnight."""
        return sum(int(part) * unit for part, unit in zip(clock.split(":"), (60, 1)))

    def time_between(self, ctx: Context, hours: str) -> bool:
        """The local time of day falls within the span in the text, HH:MM-HH:MM, a span past midnight included; a tick's own time, else now."""
        start, _, end = hours.replace(" ", "").partition("-")
        try:
            a, b = self.minute_of_day(start), self.minute_of_day(end)
        except ValueError:
            return False
        at = ctx.event.at if isinstance(ctx.event, Ticked) and ctx.event.at else self.clock.now()
        local = time.localtime(at)
        now = local.tm_hour * 60 + local.tm_min
        return a <= now < b if a <= b else now >= a or now < b

    def worker_reported(self, ctx: Context) -> bool:
        return self.worker_now(ctx, WorkerState.REPORTED)

    def worker_stopped(self, ctx: Context) -> bool:
        return self.worker_now(ctx, WorkerState.STOPPED)

    def worker_now(self, ctx: Context, state: WorkerState) -> bool:
        return self.row_became(ctx, Worker, state)

    @staticmethod
    def row_became(ctx: Context, kind: type, state) -> bool:
        """The row event is a row of the kind that this write moved into the state, not one saved again in it."""
        event = ctx.event
        return isinstance(event, Updated) and isinstance(event.model, kind) and event.model.state == state and event.was is not None and event.was.state != state

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
        return isinstance(event, Updated) and isinstance(event.model, Question) and event.model.is_answered() and event.was is not None and not event.was.is_answered()

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

    def memory_older_than(self, ctx: Context, days: int) -> bool:
        """A fact, rule or reminder here has stood at least so many days."""
        return bool(self.old_memory(days))

    def old_memory(self, days: int) -> list[str]:
        """The facts, rules and reminders standing at least so many days, each named by its kind, number and age."""
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        rows = [("fact", r) for r in self.facts.in_()] + [("rule", r) for r in self.rules.all()] + [("reminder", r) for r in self.reminders.in_()]
        return [f"{kind} {row.id}, {(datetime.now(timezone.utc) - (row.updated_at or row.created_at)).days} days" for kind, row in rows if (row.updated_at or row.created_at) and (row.updated_at or row.created_at) <= cutoff]

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
        taken = ctx.agent_in(self.machine).context_mark
        return [mark for mark in Memory.MARKS if context * 100 >= mark > taken]

    def something_owed(self, ctx: Context) -> bool:
        """The agent owes the journal a skill's read, the look at what is in flight or a decision at a mark."""
        return self.not_oriented(ctx) or self.skill_owed(ctx) or self.mark_owed(ctx)

    def mark_owed(self, ctx: Context) -> bool:
        """The agent crossed a mark and has not decided what survives it."""
        return bool(ctx.session) and bool(ctx.agent_in(self.machine).mark_owed)

    def not_oriented(self, ctx: Context) -> bool:
        """The agent has not looked at what is in flight here since its session started."""
        return bool(ctx.session) and not ctx.agent_in(self.machine).oriented

    def skill_owed(self, ctx: Context) -> bool:
        """The agent owes a read of a skill's file."""
        return bool(ctx.session) and bool(self.requiring.owed_names(ctx.agent_in(self.machine)))

    def message_by_user(self, ctx: Context) -> bool:
        """The row event is a message the user wrote."""
        return isinstance(ctx.event, ModelEvent) and isinstance(ctx.event.model, Message) and ctx.event.model.author == Author.USER

    def tool_reads_their_files(self, ctx: Context) -> bool:
        """The tool about to run reads a file attached to a message read and left unanswered: part of reading it, not work."""
        if not isinstance(ctx.event, ToolStarting):
            return False
        folders = [str(self.config.files / "message" / str(m.id)) + "/" for m in self.messages.unanswered()]
        return any(path.startswith(folder) for path in ctx.provider_in(self.providers).read_paths(ctx.event.tool, ctx.event.input) for folder in folders)

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

    def task_just_taken(self, ctx: Context) -> bool:
        """The row event is a task this write took in hand: started, resumed after a park, or claimed, by an agent or by a plan going on."""
        return self.task_became(ctx, TaskState.STARTED)

    def task_just_parked(self, ctx: Context) -> bool:
        return self.task_became(ctx, TaskState.PARKED)

    def task_just_blocked(self, ctx: Context) -> bool:
        return self.task_became(ctx, TaskState.BLOCKED)

    def task_became(self, ctx: Context, state: TaskState) -> bool:
        return self.row_became(ctx, Task, state)

    def background_running(self, ctx: Context, least: int) -> bool:
        """At least so many of the agent's commands run in the background now."""
        return len(self.outputs.in_background(ctx.session)) >= least

    @staticmethod
    def held_already(ctx: Context) -> bool:
        """An earlier step of this event held the tool."""
        return bool(ctx.held)

    @staticmethod
    def line_is(ctx: Context, key: str) -> bool:
        """The line just said is the nudge named in the text."""
        return isinstance(ctx.event, LineSaid) and ctx.event.nudge == key

    def open_question(self, ctx: Context) -> bool:
        """A question to the user here waits for its answer."""
        return bool(self.questions.open())

    def message_typed_in_terminal(self, ctx: Context) -> bool:
        """The row event is a message typed at the agent's own prompt, which the agent reads as it comes, not one sent in the chat."""
        return isinstance(ctx.event, ModelEvent) and isinstance(ctx.event.model, Message) and ctx.event.model.is_typed_in_terminal

    def message_is_reply(self, ctx: Context) -> bool:
        """The row event is a reply the agent wrote to a message."""
        return isinstance(ctx.event, Created) and isinstance(ctx.event.model, Message) and ctx.event.model.is_agents_reply

    def log_for_task_in_hand(self, ctx: Context) -> bool:
        """The row event is a log line of the task the agent has in hand."""
        event, state = ctx.event, self.state(ctx)
        return isinstance(event, Created) and isinstance(event.model, TaskLog) and isinstance(state, Working) and event.model.task_id == state.task_id

    def auto_mode(self, ctx: Context) -> bool:
        from journal.features.tasks.feature import Tasks
        return bool(self.settings.option(Tasks.AUTO))

    def own_tool(self, ctx: Context) -> bool:
        """The tool use is the agent's own, not a subagent's: a subagent's reads and writes are not the agent working again."""
        return isinstance(ctx.event, (ToolStarting, ToolFinished)) and not ctx.event.subagent

    def tool_writes(self, ctx: Context) -> bool:
        event = ctx.event
        return isinstance(event, ToolStarting) and ctx.provider_in(self.providers).writes(event.tool, event.input)

    def journal_command(self, ctx: Context) -> bool:
        event = ctx.event
        if not isinstance(event, ToolStarting) or event.tool != ctx.provider_in(self.providers).shell_tool:
            return False
        return Chain.is_journal_line(event.input.get("command", ""))

    def state(self, ctx: Context):
        """The agent's state as the walk read it once."""
        return ctx.state
