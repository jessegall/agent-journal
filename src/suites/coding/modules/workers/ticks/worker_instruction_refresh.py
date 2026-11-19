from engine.container.container import Container
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_instruction_files import WorkerInstructionFiles
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState


class WorkerInstructionRefresh:
    """Every minute each open worktree that no git operation holds has its instruction files compared with what
    its profile now says, and written only where the text differs, so a changed profile reaches a worktree made
    before it."""

    def __call__(self, container: Container) -> bool:
        files, git = container.get(WorkerInstructionFiles), container.get(WorktreeGit)
        # whether a refresh wrote a file, not whether a worktree is open; a worktree mid-rebase is left to its operation,
        # and one a dispatch is still setting up has no folder yet
        return any([files.refresh(worktree) for worktree in container.get(WorktreeQuery).open_worktrees()
                    if worktree.state is not WorktreeState.NEW and not git.is_mid_sequence(worktree)])
