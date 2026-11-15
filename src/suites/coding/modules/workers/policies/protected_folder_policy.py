from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from suites.coding.modules.workers.types.worker import Worker
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.protected_folders import ProtectedFolders
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.nudges.protected_folder_message import ProtectedFolderMessage


class ProtectedFolderPolicy(EventPolicy):
    """Stops worker edits to the project's protected folders."""

    key = "workers.protected-folder"
    rank = "access.all"
    agent_types = [Worker.key]

    def __init__(self, worktrees: WorktreeQuery, protected: ProtectedFolders, agents: AgentRows) -> None:
        self.worktrees, self.protected, self.agents = worktrees, protected, agents

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        tool = event.tool
        if tool is None or not tool.is_writing_files():
            return None
        worktree = self.worktrees.worker_worktree(agent_id)
        if worktree is None:
            return None
        profile = self.agents.find(agent_id).profile
        paths = list(tool.files)
        if tool.shell is not None:
            paths.extend(path for part in tool.shell.parts for path in part.output_paths)
        for path in paths:
            folder = self.protected.match(worktree.folder, path, profile)
            if folder:
                return ProtectedFolderMessage.declared().nudge(folder=folder)
        return None
