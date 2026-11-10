from pathlib import Path

from engine.agent.agent_write_folder import AgentWriteFolder
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class WorkerWriteFolder(AgentWriteFolder):
    def __init__(self, worktrees: WorktreeQuery) -> None:
        self.worktrees = worktrees

    def folder(self, agent_id: int) -> Path | None:
        worktree = self.worktrees.worker_worktree(agent_id)
        return Path(worktree.folder) if worktree is not None else None
