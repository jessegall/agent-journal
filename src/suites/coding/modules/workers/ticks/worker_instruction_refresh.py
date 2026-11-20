from engine.container.container import Container
from engine.errors.refusal import Refusal
from engine.file.file_access import FileAccess
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_instruction_files import WorkerInstructionFiles
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree


class WorkerInstructionRefresh:
    """Every minute each open worktree that no git operation holds has its instruction files compared with what
    its profile now says, and written only where the text differs, so a changed profile reaches a worktree made
    before it."""

    def __call__(self, container: Container) -> bool:
        files, git = container.get(WorkerInstructionFiles), container.get(WorktreeGit)
        return any([self.refresh(worktree, files, git) for worktree in container.get(WorktreeQuery).open_worktrees()])

    @staticmethod
    def refresh(worktree: Worktree, files: WorkerInstructionFiles, git: WorktreeGit) -> bool:
        if worktree.state is WorktreeState.NEW or not FileAccess.is_dir(worktree.folder):
            return False
        try:
            return not git.is_mid_sequence(worktree) and files.refresh(worktree)
        except (FileNotFoundError, Refusal):
            if FileAccess.is_dir(worktree.folder):
                raise
            return False
