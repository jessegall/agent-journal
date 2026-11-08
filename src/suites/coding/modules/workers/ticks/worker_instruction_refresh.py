from core.base.container import Container
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_instruction_files import WorkerInstructionFiles


class WorkerInstructionRefresh:
    """Every minute each open worktree's instruction files are compared with what its profile now says, and written
    only where the text differs, so a changed profile reaches a worktree made before it."""

    def __call__(self, container: Container) -> bool:
        files = container.get(WorkerInstructionFiles)
        worktrees = container.get(WorktreeQuery).open_worktrees()
        for worktree in worktrees:
            files.refresh(worktree)
        return bool(worktrees)
