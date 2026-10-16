import re

from journal.events.agent.ticked import Ticked
from journal.features.chart.context import Context
from journal.features.tasks.states.expecting import Expecting
from journal.features.tasks.states.working import Working
from journal.models.question import Question
from journal.models.task_state import TaskState
from journal.models.worker import Worker
from journal.repositories.messages import Messages
from journal.repositories.plans import Plans
from journal.repositories.tasks import Tasks

PLACEHOLDER = re.compile(r"\{\{(\w+)\}\}")


class Fillers:
    """What a node's text may name from the rows, as {{name}}: one method per placeholder, named after it; an unknown one is left as written."""

    def __init__(self, tasks: Tasks, plans: Plans, messages: Messages) -> None:
        self.tasks, self.plans, self.messages = tasks, plans, messages

    def fill(self, text: str, ctx: Context) -> str:
        return PLACEHOLDER.sub(lambda m: str(getattr(self, m.group(1))(ctx)) if hasattr(self, m.group(1)) else m.group(0), text)

    def row(self, ctx: Context) -> str:
        """The number of the row a row event is about."""
        model = getattr(ctx.event, "model", None)
        return str(model.id) if model is not None else ""

    def inbox(self, ctx: Context) -> str:
        """The inbox as the listeners name it: one message by its number, a few by theirs, more than three by their count and the command that prints them."""
        from journal.features.messages.feature import Messages as MessagesFeature
        unread = self.messages.unread(ctx.environment_id)
        return MessagesFeature.inbox(unread).rendered() if unread else ""

    def unread_count(self, ctx: Context) -> str:
        return str(len(self.messages.unread(ctx.environment_id)))

    def unread_numbers(self, ctx: Context) -> str:
        return ", ".join(str(m.id) for m in self.messages.unread(ctx.environment_id))

    def owed(self, ctx: Context) -> str:
        """The last three messages read and left unanswered, by number, as the answer hold names them."""
        return ", ".join(str(m.id) for m in self.messages.unanswered(ctx.environment_id)[-3:])

    def task(self, ctx: Context) -> str:
        """The work in hand as the task lines name it: the task's number, with what the agent is on."""
        state = self.state(ctx)
        return state.named() if isinstance(state, Working) else ""

    def task_edits(self, ctx: Context) -> str:
        """The edits since the task in hand was logged, before the write about to run."""
        state = self.state(ctx)
        return str(state.edits - 1) if isinstance(state, Working) and state.edits else "0"

    def log_command(self, ctx: Context) -> str:
        state = self.state(ctx)
        return f"journal task log {state.task_id}" if isinstance(state, Working) and state.task_id else ""

    def awaited(self, ctx: Context) -> str:
        state = self.state(ctx)
        return state.what if isinstance(state, Expecting) else ""

    def quiet_minutes(self, ctx: Context) -> str:
        return str(int(ctx.event.quiet_for // 60)) if isinstance(ctx.event, Ticked) else "0"

    def worker_n(self, ctx: Context) -> str:
        model = getattr(ctx.event, "model", None)
        return str(model.id) if isinstance(model, Worker) else ""

    def worker_name(self, ctx: Context) -> str:
        model = getattr(ctx.event, "model", None)
        return model.name if isinstance(model, Worker) else ""

    def question_n(self, ctx: Context) -> str:
        model = getattr(ctx.event, "model", None)
        return str(model.id) if isinstance(model, Question) else ""

    def parked_n(self, ctx: Context) -> str:
        parked = self.tasks.in_state(ctx.environment_id, TaskState.PARKED)
        return str(parked[0].id) if parked else ""

    def parked_title(self, ctx: Context) -> str:
        parked = self.tasks.in_state(ctx.environment_id, TaskState.PARKED)
        return parked[0].title if parked else ""

    def parked_why(self, ctx: Context) -> str:
        parked = self.tasks.in_state(ctx.environment_id, TaskState.PARKED)
        return parked[0].parked_why if parked else ""

    def state(self, ctx: Context):
        return ctx.state

    def parked_tasks(self, ctx: Context) -> str:
        return "; ".join(f"{t.id} {t.title} (parked because: {t.parked_why})" for t in self.tasks.in_state(ctx.environment_id, TaskState.PARKED))

    def next_task(self, ctx: Context) -> str:
        free = self.plans.free(ctx.environment_id)
        return str(free[0].id) if free else ""

    def next_task_title(self, ctx: Context) -> str:
        free = self.plans.free(ctx.environment_id)
        return free[0].title if free else ""
