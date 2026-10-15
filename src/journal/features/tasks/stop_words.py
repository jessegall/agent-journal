from journal.engine.agent_state import AgentState
from journal.features.said import Said
from journal.features.tasks.states.idle import Idle
from journal.features.tasks.states.working import Working
from journal.models.task_state import TaskState
from journal.repositories.settings import PROJECT, Settings
from journal.repositories.tasks import Tasks

AUTO = "tasks.auto"
"""With auto on, the agent works the list: a stop with a task open is answered with the next one, and only the user stops it."""


class StopWords:
    """What the journal says when an agent stops: carry on with the task in hand; the parked tasks, in any mode; or in auto mode the next open task and whether the agent means to stop."""

    def __init__(self, tasks: Tasks, settings: Settings) -> None:
        self.tasks, self.settings = tasks, settings

    def for_(self, state: AgentState, environment_id: int) -> Said | None:
        from journal.features.tasks.feature import Tasks as TasksFeature
        if isinstance(state, Working):
            return TasksFeature.CARRY_ON.about(n=state.task_id)
        if not isinstance(state, Idle):
            return None
        parked = self.tasks.in_state(environment_id, TaskState.PARKED)
        if parked:
            return TasksFeature.PARKED_AT_STOP.about(rows="; ".join(f"{t.id} {t.title} (parked because: {t.parked_why})" for t in parked))
        open_ = self.tasks.in_state(environment_id, TaskState.OPEN)
        if open_ and self.settings.get(PROJECT, AUTO, True):
            return TasksFeature.NEXT.about(n=open_[0].id, title=open_[0].title)
        return None
