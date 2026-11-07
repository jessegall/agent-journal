from core.base.command.context import Context
from core.base.repository.repository import Repository
from core.modules.processes.support.output_delivery import OutputDelivery
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree


class WorkerLogRead:
    """Records a log read when its full output reaches the agent."""

    def __init__(self, delivery: OutputDelivery, repository: Repository) -> None:
        self.delivery, self.repository = delivery, repository

    def pending_output(self, text: str, process_id: int | None, json_output: bool, context: Context) -> int | None:
        return self.delivery.pending(text, {"line": text}, process_id, json_output, context)

    def record(self, worktree: Worktree, output_id: int | None, context: Context) -> None:
        read_at = context.timestamp if output_id is None else None
        self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.review_logs, logs_read_at=read_at, logs_output_id=output_id), context)
