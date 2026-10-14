from dataclasses import dataclass

from journal.engine.agent_state import AgentState
from journal.engine.permission import Permission
from journal.engine.transition import Transition
from journal.events.agent.compacting import Compacting
from journal.events.agent.idle import Idle as AgentIdle
from journal.events.agent.session_started import SessionStarted


@dataclass(frozen=True)
class Working(AgentState):
    """On one task. Writes are allowed; stopping with the task open is told to carry on; compacting is told to log first."""

    name = "working"
    allows = frozenset({Permission.WRITE_FILES, Permission.RUN_COMMANDS, Permission.DISPATCH_SUBAGENTS})
    task_id: int = 0

    def idle(self, event: AgentIdle) -> Transition:
        from journal.features.tasks.feature import Tasks
        return self.stay(Tasks.CARRY_ON.about(n=self.task_id))

    def compacting(self, event: Compacting) -> Transition:
        from journal.features.tasks.feature import Tasks
        return self.stay(Tasks.LOG_FIRST.about(n=self.task_id))

    def session_started(self, event: SessionStarted) -> Transition:
        """A session resumed with a task in hand is told which."""
        from journal.features.tasks.feature import Tasks
        return self.stay(Tasks.CARRY_ON.about(n=self.task_id))
