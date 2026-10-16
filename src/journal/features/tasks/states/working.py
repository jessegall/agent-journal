from dataclasses import dataclass, replace

from journal.engine.agent_state import AgentState
from journal.engine.permission import Permission
from journal.engine.transition import Transition
from journal.events.agent.idle import Idle as AgentIdle
from journal.events.agent.tool_starting import ToolStarting



@dataclass(frozen=True)
class Working(AgentState):
    """On one task. Writes are allowed and counted: every tenth names the task, and the twentieth with nothing logged waits for a log line; stopping with the task open is told to carry on; a long silence is told the task is still open."""

    name = "working"
    title = "Working"
    allows = frozenset({Permission.WRITE_FILES, Permission.RUN_COMMANDS, Permission.DISPATCH_SUBAGENTS})
    task_id: int = 0
    what: str = ""
    """Work declared without a task: what the agent said it is doing."""
    edits: int = 0
    """Writes since the last log line."""
    logged_at: float = 0.0
    """When the work was last logged, or started; the version a stop's reminders count against."""
    reminders: int = 0
    """Stops at which this version of the work was named back; three at most."""

    def named(self) -> str:
        if self.task_id and self.what:
            return f"task {self.task_id}, {self.what}"
        return f"task {self.task_id}" if self.task_id else f"the work in hand, {self.what}"

    def reminded(self) -> "Working":
        return replace(self, reminders=self.reminders + 1)

    def tool_starting(self, event: ToolStarting) -> Transition:
        return self.go(replace(self, edits=self.edits + 1)) if event.writes else self.stay()

    def logged(self, at: float) -> "Working":
        return replace(self, edits=0, logged_at=at, reminders=0)

    def idle(self, event: AgentIdle) -> Transition:
        """A stop with a task in hand counts as a reminder; what it is told is the Working workflow's."""
        return self.go(self.reminded())
