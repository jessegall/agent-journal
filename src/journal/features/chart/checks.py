import time
from journal.config import Config
from journal.engine.machine import Machine
from journal.events.agent.idle import Idle
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_starting import ToolStarting
from journal.events.models.model_event import ModelEvent
from journal.events.models.updated import Updated
from journal.features.chart.context import Context
from journal.features.registry import Registry
from journal.features.shell.chain import Chain
from journal.features.tasks.states.working import Working
from journal.features.questions.states.waiting import Waiting
from journal.features.workers.states.awaiting import Awaiting
from journal.models.author import Author
from journal.models.message import Message
from journal.models.question import Question
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
from journal.repositories.settings import Settings
from journal.repositories.tasks import Tasks


COUNTERS = ("tool_uses_since_unread_every", "tool_uses_since_unread_over", "tool_uses_since_read_over", "edits_since_log_over", "edits_since_log_every", "edits_since_log_at", "quiet_for_over", "unread_over", "unread_reminders_over", "log_stale_over")
"""The checks that take a number: the node's text, or the setting named there."""


class Checks:
    """The catalogue's checks answered from the rows: one method per key, named after it. A counter check takes the node's text as its number, or the name of the setting that holds it."""

    def __init__(self, tasks: Tasks, plans: Plans, messages: Messages, settings: Settings, machine: Machine, providers: Providers, entries: Entries, registry: Registry, config: Config, workers: Workers) -> None:
        self.tasks, self.plans, self.messages, self.settings, self.machine, self.providers, self.entries = tasks, plans, messages, settings, machine, providers, entries
        self.registry, self.config, self.workers = registry, config, workers

    def answer(self, key: str, ctx: Context, text: str = "") -> bool:
        check = getattr(self, key)
        return bool(check(ctx, self.number(text)) if key in COUNTERS else check(ctx))

    def number(self, text: str) -> int:
        """The node's text as a number, or the setting it names, read through its option so an unset key means the option's default, or nothing."""
        if text.strip().isdigit():
            return int(text)
        option = next((o for o in self.registry.options() if o.key == text.strip()), None)
        if option:
            return int(self.settings.option(option))
        return int(self.settings.project(text.strip(), 0)) if text.strip() else 0

    def tool_uses_since_unread_every(self, ctx: Context, every: int) -> bool:
        """Every so many tool uses since the oldest unread message came, counting the one about to run."""
        uses = self.uses_since(ctx, self.oldest_unread(ctx))
        return bool(every) and uses is not None and uses % every == 0

    def unread_reminders_over(self, ctx: Context, n: int) -> bool:
        """So many namings of the unread inbox gone by: the tool uses since the oldest unread message came, in units of messages.remind_every."""
        from journal.features.messages.feature import Messages as MessagesFeature
        uses = self.uses_since(ctx, self.oldest_unread(ctx))
        every = int(self.settings.option(MessagesFeature.REMIND_EVERY))
        return uses is not None and bool(every) and uses // every >= n

    def tool_uses_since_unread_over(self, ctx: Context, limit: int) -> bool:
        uses = self.uses_since(ctx, self.oldest_unread(ctx))
        return uses is not None and uses >= limit

    def tool_uses_since_read_over(self, ctx: Context, limit: int) -> bool:
        """So many tool uses since the oldest message was read and left unanswered."""
        owed = self.messages.unanswered()
        uses = self.uses_since(ctx, min(m.read_at for m in owed)) if owed else None
        return uses is not None and uses >= limit

    def edits_since_log_over(self, ctx: Context, limit: int) -> bool:
        return self.edits_before(ctx) >= limit

    def edits_since_log_every(self, ctx: Context, every: int) -> bool:
        before = self.edits_before(ctx)
        return bool(every) and before > 0 and before % every == 0

    def edits_since_log_at(self, ctx: Context, n: int) -> bool:
        return self.edits_before(ctx) == n

    def log_stale_over(self, ctx: Context, seconds: int) -> bool:
        """The task in hand was last logged longer ago than so many seconds, or never."""
        state = self.state(ctx)
        return isinstance(state, Working) and (not state.logged_at or time.time() - state.logged_at > seconds)

    def edits_before(self, ctx: Context) -> int:
        """The edits since the task in hand was logged, before the write about to run: the machine counted that one already, as the log cadence counts."""
        state = self.state(ctx)
        return state.edits - 1 if isinstance(state, Working) and state.edits else -1

    def oldest_unread(self, ctx: Context):
        unread = self.messages.unread()
        return min(m.created_at for m in unread) if unread else None

    def uses_since(self, ctx: Context, since) -> int | None:
        if since is None or not ctx.session:
            return None
        return len([e for e in self.entries.of_kind("ToolStarting", 200) if e.actor and e.actor.id == ctx.session and e.created_at >= since])

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
        """The agent's state as the walk read it once, looking through the pauses the agent owes the journal to the state beneath, whose conduct the walk runs; None when the walk is about no agent."""
        return self.machine.states.beneath(ctx.state) if ctx.state else None
