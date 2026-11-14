from engine.container.container import Container
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_instruction_files import WorkerInstructionFiles


class WorkerInstructionRefresh:
    """Every minute each open worktree's instruction files are compared with what its profile now says, and written
    only where the text differs, so a changed profile reaches a worktree made before it."""

    def __call__(self, container: Container) -> bool:
        files = container.get(WorkerInstructionFiles)
        # whether a refresh wrote a file, not whether a worktree is open
        return any([files.refresh(worktree) for worktree in container.get(WorktreeQuery).open_worktrees()])
