from journal.engine.machine import Machine
from journal.events.agent.idle import Idle
from journal.events.agent.tool_starting import ToolStarting
from journal.features.chart.context import Context
from journal.features.plans.states.following_plan import FollowingPlan
from journal.features.sequences.states.running_sequence import RunningSequence
from journal.features.shell.chain import Chain
from journal.features.tasks.states.working import Working
from journal.features.tasks.stop_words import AUTO
from journal.models.task_state import TaskState
from journal.providers.providers import Providers
from journal.repositories.messages import Messages
from journal.repositories.not_found import NotFound
from journal.repositories.plans import Plans
from journal.repositories.settings import PROJECT, Settings
from journal.repositories.tasks import Tasks


class Checks:
    """The catalogue's checks answered from the rows: one method per key, named after it."""

    def __init__(self, tasks: Tasks, plans: Plans, messages: Messages, settings: Settings, machine: Machine, providers: Providers) -> None:
        self.tasks, self.plans, self.messages, self.settings, self.machine, self.providers = tasks, plans, messages, settings, machine, providers

    def answer(self, key: str, ctx: Context) -> bool:
        return bool(getattr(self, key)(ctx))

    def open_tasks(self, ctx: Context) -> bool:
        return bool(self.plans.free(ctx.environment_id))

    def task_in_hand(self, ctx: Context) -> bool:
        state = self.state(ctx)
        return isinstance(state, Working) and bool(state.task_id)

    def work_declared(self, ctx: Context) -> bool:
        state = self.state(ctx)
        return isinstance(state, Working) and bool(state.what)

    def parked_tasks(self, ctx: Context) -> bool:
        return bool(self.tasks.in_state(ctx.environment_id, TaskState.PARKED))

    def blocked_tasks(self, ctx: Context) -> bool:
        return bool(self.tasks.in_state(ctx.environment_id, TaskState.BLOCKED))

    def unread_messages(self, ctx: Context) -> bool:
        return bool(self.messages.unread(ctx.environment_id))

    def unanswered_messages(self, ctx: Context) -> bool:
        return bool(self.messages.unanswered(ctx.environment_id))

    def auto_mode(self, ctx: Context) -> bool:
        return bool(self.settings.get(PROJECT, AUTO, True))

    def same_stop_again(self, ctx: Context) -> bool:
        return isinstance(ctx.event, Idle) and ctx.event.again

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
