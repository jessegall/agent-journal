from dataclasses import dataclass, replace

from journal.engine.agent_state import AgentState
from journal.engine.permission import Permission



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

    def named(self) -> str:
        if self.task_id and self.what:
            return f"task {self.task_id}, {self.what}"
        return f"task {self.task_id}" if self.task_id else f"the work in hand, {self.what}"

    def logged(self, at: float) -> "Working":
        return replace(self, logged_at=at)
