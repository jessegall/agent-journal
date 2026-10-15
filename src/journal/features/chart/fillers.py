import re

from journal.features.chart.context import Context
from journal.models.task_state import TaskState
from journal.repositories.plans import Plans
from journal.repositories.tasks import Tasks

PLACEHOLDER = re.compile(r"\{\{(\w+)\}\}")


class Fillers:
    """What a node's text may name from the rows, as {{name}}: one method per placeholder, named after it; an unknown one is left as written."""

    def __init__(self, tasks: Tasks, plans: Plans) -> None:
        self.tasks, self.plans = tasks, plans

    def fill(self, text: str, ctx: Context) -> str:
        return PLACEHOLDER.sub(lambda m: str(getattr(self, m.group(1))(ctx)) if hasattr(self, m.group(1)) else m.group(0), text)

    def parked_tasks(self, ctx: Context) -> str:
        return "; ".join(f"{t.id} {t.title} (parked because: {t.parked_why})" for t in self.tasks.in_state(ctx.environment_id, TaskState.PARKED))

    def next_task(self, ctx: Context) -> str:
        free = self.plans.free(ctx.environment_id)
        return str(free[0].id) if free else ""

    def next_task_title(self, ctx: Context) -> str:
        free = self.plans.free(ctx.environment_id)
        return free[0].title if free else ""
