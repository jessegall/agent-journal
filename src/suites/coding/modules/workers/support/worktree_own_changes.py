from pathlib import Path

from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.journal_managed_files import JournalManagedFiles
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class WorktreeOwnChanges:
    """Whether a worker's worktree holds uncommitted files of its own, beside the files the journal manages there."""

    def __init__(self, git: WorktreeGit, managed_files: JournalManagedFiles) -> None:
        self.git, self.managed_files = git, managed_files

    def has_worker_changes(self, agent: Agent, worktree: Worktree) -> bool:
        if worktree.removed_at is not None or not Path(worktree.folder).exists():
            return False
        return any(not self.managed_files.has(agent, path) for path in self.git.uncommitted_files(worktree.folder))
