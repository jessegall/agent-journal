from dataclasses import dataclass, replace

from journal.engine.agent_state import AgentState
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.rows.task_started import TaskStarted
from journal.support.permission import Permission



@dataclass(frozen=True)
class Working(AgentState):
    """On one task: writes are allowed, and what is said about them is the Working workflows' on the counts they keep; stopping with the task open is told to carry on."""

    name = "working"
    title = "Working"
    allows = frozenset({Permission.WRITE_FILES, Permission.RUN_COMMANDS, Permission.DISPATCH_SUBAGENTS})
    task_id: int = 0
    what: str = ""
    """Work declared without a task: what the agent said it is doing."""
    logged_at: float = 0.0
    """When the work was last logged, or started."""

    def follows_a_plan(self) -> bool:
        """Whether the plan moves this agent on when its task closes."""
        return False

    def named(self) -> str:
        if self.task_id and self.what:
            return f"task {self.task_id}, {self.what}"
        return f"task {self.task_id}" if self.task_id else f"the work in hand, {self.what}"

    def logged(self, at: float) -> "Working":
        return replace(self, logged_at=at)

    def on_task_started(self, event: TaskStarted, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        from journal.features.plans.states.following_plan import FollowingPlan
        started = event.standing.of(Plans).started
        if self.follows_a_plan() or started is None or event.task_id != self.task_id or event.task_id not in started.tasks:
            return self.stay()
        return self.go(FollowingPlan(plan_id=started.plan_id, task_id=self.task_id, logged_at=self.logged_at))
