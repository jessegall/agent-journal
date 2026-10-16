from journal.config import Config
from journal.engine.machine import Machine
from journal.events.agent.idle import Idle
from journal.events.agent.tool_starting import ToolStarting
from journal.events.models.model_event import ModelEvent
from journal.features.chart.context import Context
from journal.features.plans.states.following_plan import FollowingPlan
from journal.features.registry import Registry
from journal.features.sequences.states.running_sequence import RunningSequence
from journal.features.shell.chain import Chain
from journal.features.tasks.states.idle import Idle as IdleState
from journal.features.tasks.states.working import Working
from journal.models.author import Author
from journal.models.message import Message
from journal.models.task_state import TaskState
from journal.providers.providers import Providers
from journal.repositories.entries import Entries
from journal.repositories.messages import Messages
from journal.repositories.not_found import NotFound
from journal.repositories.plans import Plans
from journal.repositories.settings import PROJECT, Settings
from journal.repositories.tasks import Tasks


COUNTERS = ("tool_uses_since_unread_every", "tool_uses_since_unread_over", "tool_uses_since_read_over", "edits_since_log_over", "edits_since_log_every", "edits_since_log_at")
"""The checks that take a number: the node's text, or the setting named there."""


class Checks:
    """The catalogue's checks answered from the rows: one method per key, named after it. A counter check takes the node's text as its number, or the name of the setting that holds it."""

    def __init__(self, tasks: Tasks, plans: Plans, messages: Messages, settings: Settings, machine: Machine, providers: Providers, entries: Entries, registry: Registry, config: Config) -> None:
        self.tasks, self.plans, self.messages, self.settings, self.machine, self.providers, self.entries = tasks, plans, messages, settings, machine, providers, entries
        self.registry, self.config = registry, config

    def answer(self, key: str, ctx: Context, text: str = "") -> bool:
        check = getattr(self, key)
        return bool(check(ctx, self.number(text)) if key in COUNTERS else check(ctx))

    def number(self, text: str) -> int:
        """The node's text as a number, or the setting it names, read through its option so an unset key means the option's default, or nothing."""
        if text.strip().isdigit():
            return int(text)
        option = next((o for o in self.registry.options() if o.key == text.strip()), None)
        if option:
            return int(self.settings.option(PROJECT, option))
        return int(self.settings.get(PROJECT, text.strip(), 0)) if text.strip() else 0

    def tool_uses_since_unread_every(self, ctx: Context, every: int) -> bool:
        """Every so many tool uses since the oldest unread message came, counting the one about to run."""
        uses = self.uses_since(ctx, self.oldest_unread(ctx))
        return bool(every) and uses is not None and uses % every == 0

    def tool_uses_since_unread_over(self, ctx: Context, limit: int) -> bool:
        uses = self.uses_since(ctx, self.oldest_unread(ctx))
        return uses is not None and uses >= limit

    def tool_uses_since_read_over(self, ctx: Context, limit: int) -> bool:
        """So many tool uses since the oldest message was read and left unanswered."""
        owed = self.messages.unanswered(ctx.environment_id)
        uses = self.uses_since(ctx, min(m.read_at for m in owed)) if owed else None
        return uses is not None and uses >= limit

    def edits_since_log_over(self, ctx: Context, limit: int) -> bool:
        return self.edits_before(ctx) >= limit

    def edits_since_log_every(self, ctx: Context, every: int) -> bool:
        before = self.edits_before(ctx)
        return bool(every) and before > 0 and before % every == 0

    def edits_since_log_at(self, ctx: Context, n: int) -> bool:
        return self.edits_before(ctx) == n

    def edits_before(self, ctx: Context) -> int:
        """The edits since the task in hand was logged, before the write about to run: the machine counted that one already, as the log cadence counts."""
        state = self.state(ctx)
        return state.edits - 1 if isinstance(state, Working) and state.edits else -1

    def oldest_unread(self, ctx: Context):
        unread = self.messages.unread(ctx.environment_id)
        return min(m.created_at for m in unread) if unread else None

    def uses_since(self, ctx: Context, since) -> int | None:
        if since is None or not ctx.session:
            return None
        return len([e for e in self.entries.of_kind(ctx.environment_id, "ToolStarting", 200) if e.actor and e.actor.id == ctx.session and e.created_at >= since])

    def plain_idle(self, ctx: Context) -> bool:
        return isinstance(self.state(ctx), IdleState)

    def open_tasks(self, ctx: Context) -> bool:
        return bool(self.plans.free(ctx.environment_id))

    def task_in_hand(self, ctx: Context) -> bool:
        state = self.state(ctx)
        return isinstance(state, Working) and bool(state.task_id)

    def parked_tasks(self, ctx: Context) -> bool:
        return bool(self.tasks.in_state(ctx.environment_id, TaskState.PARKED))

    def blocked_tasks(self, ctx: Context) -> bool:
        return bool(self.tasks.in_state(ctx.environment_id, TaskState.BLOCKED))

    def message_by_user(self, ctx: Context) -> bool:
        """The row event is a message the user wrote."""
        return isinstance(ctx.event, ModelEvent) and isinstance(ctx.event.model, Message) and ctx.event.model.author == Author.USER

    def tool_reads_their_files(self, ctx: Context) -> bool:
        """The tool about to run reads a file attached to a message read and left unanswered: part of reading it, not work."""
        if not isinstance(ctx.event, ToolStarting) or ctx.event.tool != "Read":
            return False
        path = str(ctx.event.input.get("file_path", ""))
        return any(path.startswith(str(self.config.home / "files" / "message" / str(m.id)) + "/") for m in self.messages.unanswered(ctx.environment_id))

    def unread_messages(self, ctx: Context) -> bool:
        return bool(self.messages.unread(ctx.environment_id))

    def unanswered_messages(self, ctx: Context) -> bool:
        return bool(self.messages.unanswered(ctx.environment_id))

    def auto_mode(self, ctx: Context) -> bool:
        from journal.features.tasks.feature import Tasks
        return bool(self.settings.option(PROJECT, Tasks.AUTO))

    def following_plan(self, ctx: Context) -> bool:
        return isinstance(self.state(ctx), FollowingPlan)

    def tool_writes(self, ctx: Context) -> bool:
        event = ctx.event
        return isinstance(event, ToolStarting) and self.providers.named(ctx.provider).writes(event.tool, event.input)

    def journal_command(self, ctx: Context) -> bool:
        event = ctx.event
        if not isinstance(event, ToolStarting) or event.tool != "Bash":
            return False
        journal, parts = Chain.journal_parts(event.input.get("command", ""))
        return parts > 0 and journal == parts

    def running_sequence(self, ctx: Context) -> bool:
        return isinstance(self.state(ctx), RunningSequence)

    def state(self, ctx: Context):
        """The agent's state, or None when the walk is about no agent."""
        if not ctx.session:
            return None
        try:
            return self.machine.current(ctx.session)
        except NotFound:
            return None
