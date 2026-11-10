from dataclasses import replace

from engine.change.deleted import Deleted
from engine.command.context import Context
from engine.listener.deletion_listener import DeletionListener
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.models.worktree import Worktree


class WorkerProcessRemovalListener(DeletionListener[Deleted[Process]]):
    """Lets go of a process that old runs are pruned of: its worker operations go with it, and merger lines and
    worktrees keep their rows without the output they once named."""

    name = "workers.process-removal"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Deleted[Process], context: Context) -> None:
        process = event.row
        for operation in tuple(self.queries.query(WorkerOperation).filter(process_id=process.id).all_rows()):
            self.repository.delete(operation, context)
        for line in tuple(self.queries.query(MergerLine).filter(read_output_id=process.id).all_rows()):
            self.repository.save(replace(line, read_output_id=None), context)
        for worktree in tuple(self.queries.query(Worktree).with_removed().filter(logs_output_id=process.id).all_rows()):
            self.repository.update(worktree, context, logs_output_id=None)
