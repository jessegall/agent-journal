import time

from journal.engine.agent_state import AgentState
from journal.features.said import Said
from journal.features.tasks.states.idle import Idle
from journal.features.tasks.states.working import Working
from journal.models.task_state import TaskState
from journal.repositories.settings import Settings
from journal.repositories.plans import Plans
from journal.repositories.tasks import Tasks

LOG_STALE = 10 * 60
"""Seconds since the last log after which a stop asks for one."""


class StopWords:
    """What the journal says when an agent stops with work in hand: carry on. Parked tasks and the next open task are the chart's to say."""

    @staticmethod
    def carry_on(state: Working) -> Said:
        """A stop with work in hand is told to carry on; a log is asked for only when the last one is stale, never at every stop."""
        from journal.features.tasks.feature import Tasks as TasksFeature
        logged = f"last logged {ago(state.logged_at)}" if state.logged_at else "nothing logged yet"
        stale = not state.logged_at or time.time() - state.logged_at > LOG_STALE
        return (TasksFeature.CARRY_ON_LOG if stale else TasksFeature.CARRY_ON).about(name=state.named(), logged=logged)

    def __init__(self, tasks: Tasks, plans: Plans, settings: Settings) -> None:
        self.tasks, self.plans, self.settings = tasks, plans, settings

    def for_(self, state: AgentState, environment_id: int) -> Said | None:
        from journal.features.tasks.feature import Tasks as TasksFeature
        if isinstance(state, Working):
            return self.carry_on(state)
        return None


def ago(at: float) -> str:
    minutes = int((time.time() - at) // 60)
    return "just now" if minutes < 1 else f"{minutes} min ago" if minutes < 60 else f"{minutes // 60} h ago"
