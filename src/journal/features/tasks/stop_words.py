import time

from journal.engine.agent_state import AgentState
from journal.features.said import Said
from journal.features.tasks.states.idle import Idle
from journal.features.tasks.states.working import Working
from journal.models.task_state import TaskState
from journal.repositories.settings import PROJECT, Settings
from journal.repositories.plans import Plans
from journal.repositories.tasks import Tasks

AUTO = "tasks.auto"
"""With auto on, the agent works the list: a stop with a task open is answered with the next one, and only the user stops it."""


class StopWords:
    """What the journal says when an agent stops: carry on with the task in hand; the parked tasks, in any mode; or in auto mode the next open task and whether the agent means to stop."""

    @staticmethod
    def carry_on(state: Working) -> Said:
        from journal.features.tasks.feature import Tasks as TasksFeature
        logged = f"last logged {ago(state.logged_at)}" if state.logged_at else "nothing logged yet"
        return TasksFeature.CARRY_ON.about(name=state.named(), logged=logged)

    def __init__(self, tasks: Tasks, plans: Plans, settings: Settings) -> None:
        self.tasks, self.plans, self.settings = tasks, plans, settings

    def for_(self, state: AgentState, environment_id: int) -> Said | None:
        from journal.features.tasks.feature import Tasks as TasksFeature
        if isinstance(state, Working):
            return self.carry_on(state)
        if not isinstance(state, Idle):
            return None
        parked = self.tasks.in_state(environment_id, TaskState.PARKED)
        if parked:
            return TasksFeature.PARKED_AT_STOP.about(rows="; ".join(f"{t.id} {t.title} (parked because: {t.parked_why})" for t in parked))
        open_ = self.plans.free(environment_id)
        if open_ and self.settings.get(PROJECT, AUTO, True):
            return TasksFeature.NEXT.about(n=open_[0].id, title=open_[0].title)
        return None


def ago(at: float) -> str:
    minutes = int((time.time() - at) // 60)
    return "just now" if minutes < 1 else f"{minutes} min ago" if minutes < 60 else f"{minutes // 60} h ago"
