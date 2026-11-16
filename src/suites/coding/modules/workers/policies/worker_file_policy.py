from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.cli.row_numbers import RowNumbers
from pathlib import Path

from engine.enums.agent_role import AgentRole
from suites.coding.modules.workers.support.worker_worktrees import WorkerWorktrees
from suites.coding.modules.workers.agent_messages.worker_file_message import WorkerFileMessage
from core.modules.agents.support.agent_number_messages import AgentNumberMessages


class WorkerFilePolicy(EventPolicy):
    """The main agent edits no file inside a worker's worktree: the work goes to the worker."""

    key = "workers.worker-file"
    rank = "access.all"
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, worktrees: WorkerWorktrees, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.worktrees = worktrees

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        tool = event.tool
        if tool is None or not tool.is_writing_files():
            return None
        for worktree in self.worktrees.main_worktrees():
            if any(Path(path).is_relative_to(worktree.folder) for path in tool.files):
                return AgentNumberMessages.message(self.numbers, WorkerFileMessage, "worker", worktree.session_agent_id)
        return None
