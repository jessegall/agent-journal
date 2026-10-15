from dataclasses import dataclass

from journal.engine.agent_state import AgentState
from journal.engine.permission import Permission
from journal.engine.transition import Transition
from journal.events.agent.idle import Idle as AgentIdle
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_starting import ToolStarting

QUIET_AFTER = 900.0
LOG_AFTER = 20
"""Edits with nothing logged before the next write waits for a log line."""
NAME_EVERY = 10
"""Edits between namings of the work in hand, so the agent notices when it drifted."""


@dataclass(frozen=True)
class Working(AgentState):
    """On one task. Writes are allowed and counted: every tenth names the task, and the twentieth with nothing logged waits for a log line; stopping with the task open is told to carry on; a long silence is told the task is still open."""

    name = "working"
    allows = frozenset({Permission.WRITE_FILES, Permission.RUN_COMMANDS, Permission.DISPATCH_SUBAGENTS})
    task_id: int = 0
    edits: int = 0

    def tool_starting(self, event: ToolStarting) -> Transition:
        from journal.features.tasks.feature import Tasks
        if not event.writes:
            return self.stay()
        if self.edits >= LOG_AFTER:
            return self.refuse(Tasks.LOG_OVERDUE.about(n=self.task_id, edits=self.edits))
        counted = Working(task_id=self.task_id, edits=self.edits + 1)
        return self.go(counted, Tasks.IN_HAND.about(n=self.task_id)) if counted.edits % NAME_EVERY == 0 else self.go(counted)

    def logged(self) -> "Working":
        return Working(task_id=self.task_id, edits=0)

    def idle(self, event: AgentIdle) -> Transition:
        from journal.features.tasks.feature import Tasks
        return self.stay() if event.again else self.stay(Tasks.CARRY_ON.about(n=self.task_id))

    def session_started(self, event: SessionStarted) -> Transition:
        """A session resumed with a task in hand is told which."""
        from journal.features.tasks.feature import Tasks
        return self.stay(Tasks.CARRY_ON.about(n=self.task_id))

    def ticked(self, event: Ticked) -> Transition:
        from journal.features.tasks.feature import Tasks
        return self.stay(Tasks.OPEN.about(n=self.task_id)) if event.quiet_for >= QUIET_AFTER else self.stay()
