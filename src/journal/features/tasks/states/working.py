from dataclasses import dataclass

from journal.engine.agent_state import AgentState
from journal.engine.permission import Permission
from journal.engine.transition import Transition
from journal.events.agent.idle import Idle as AgentIdle
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_starting import ToolStarting

QUIET_AFTER = 900.0


@dataclass(frozen=True)
class Working(AgentState):
    """On one task. Writes are allowed and counted: every tenth names the task, and the twentieth with nothing logged waits for a log line; stopping with the task open is told to carry on; a long silence is told the task is still open."""

    name = "working"
    allows = frozenset({Permission.WRITE_FILES, Permission.RUN_COMMANDS, Permission.DISPATCH_SUBAGENTS})
    task_id: int = 0
    what: str = ""
    """Work declared without a task: what the agent said it is doing."""
    uses: int = 0

    def named(self) -> str:
        return f"task {self.task_id}" if self.task_id else f"the work in hand, {self.what}"

    def tool_starting(self, event: ToolStarting) -> Transition:
        return self.go(Working(task_id=self.task_id, what=self.what, uses=self.uses + 1))

    def logged(self) -> "Working":
        return Working(task_id=self.task_id, what=self.what, uses=0)

    def idle(self, event: AgentIdle) -> Transition:
        from journal.features.tasks.feature import Tasks
        return self.stay() if event.again else self.stay(Tasks.CARRY_ON.about(name=self.named()))

    def session_started(self, event: SessionStarted) -> Transition:
        """A session resumed with a task in hand is told which."""
        from journal.features.tasks.feature import Tasks
        return self.stay(Tasks.CARRY_ON.about(name=self.named()))

    def ticked(self, event: Ticked) -> Transition:
        from journal.features.tasks.feature import Tasks
        return self.stay(Tasks.OPEN.about(name=self.named())) if event.quiet_for >= QUIET_AFTER else self.stay()
