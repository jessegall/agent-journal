from collections.abc import Sequence
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.cli.row_numbers import RowNumbers
from engine.driver.agent_message import AgentMessage
from suites.coding.modules.workers.agent_messages.worker_task_message import WorkerTaskMessage
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from engine.enums.agent_role import AgentRole
from core.modules.agents.support.agent_number_messages import AgentNumberMessages


class WorkersOutLines(EventLineSource):
    """A main agent's session starts with a line for each worker of its environment that still has a worktree
    out."""

    start_line = True
    key = "workers.workers-out-at-start"
    events = [HookEventName.SESSION_START]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, worktrees: WorktreeQuery, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.worktrees = worktrees

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        agent_messages: list[AgentMessage] = [AgentNumberMessages.message(self.numbers, WorkerTaskMessage, "worker", worktree.session_agent_id, task=worktree.task_id) for worktree in self.worktrees.open_worktrees()]
        return [*agent_messages] if agent_messages else []
