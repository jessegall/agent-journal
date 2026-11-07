from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.repository.repository import Repository
from suites.coding.modules.workers.support.worker_opening_rows import WorkerOpeningRows
from suites.coding.modules.workers.commands.cancel_worker_opening.cancel_worker_opening import CancelWorkerOpening
from suites.coding.modules.workers.models.worktree import Worktree


class CancelWorkerOpeningHandler(Handler[CancelWorkerOpening, None]):
    """Deletes the worktree row of a dispatch that never got cut, then its worker's agent row and actor; a worker
    other rows already refer to stays in the record, ended, so a failed dispatch never holds a worker's place."""

    command = CancelWorkerOpening
    runs_once = True

    def __init__(self, rows: EventRows, repository: Repository, opening: WorkerOpeningRows) -> None:
        self.rows, self.repository, self.opening = rows, repository, opening

    def handle(self, command: CancelWorkerOpening, context: Context) -> None:
        worktree = self.rows.required(Worktree, command.worktree_id)
        self.repository.delete(worktree, context)
        if command.retain_agent:
            return
        self.opening.remove_agent(worktree.session_agent_id, context)
