from collections.abc import Sequence
from dataclasses import replace

from engine.event.deleted import Deleted
from engine.command.context import Context
from engine.listener.deletion_listener import DeletionListener
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.models.worktree import Worktree

REMOVED_PROCESSES_REASON = "removed processes leave every operation, line and worktree that pointed at them"


class WorkerProcessRemovalListener(DeletionListener[Deleted[Process]]):
    """Lets go of a process that old runs are pruned of: its worker operations go with it, and merger lines and
    worktrees keep their rows without the output they once named."""

    name = "workers.process-removal"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Deleted[Process], context: Context) -> None:
        self.handle_many([event], context)

    def handle_many(self, events: Sequence[Deleted[Process]], context: Context) -> None:
        process_ids = [event.row.id for event in events]
        self.repository.delete_many_stored(tuple(self.queries.query(WorkerOperation).matching(Among("process_id", process_ids)).every_row(REMOVED_PROCESSES_REASON)), context)
        for line in tuple(self.queries.query(MergerLine).matching(Among("read_output_id", process_ids)).every_row(REMOVED_PROCESSES_REASON)):
            self.repository.save(replace(line, read_output_id=None), context)
        for worktree in tuple(self.queries.query(Worktree).with_removed().matching(Among("logs_output_id", process_ids)).every_row(REMOVED_PROCESSES_REASON)):
            self.repository.update(worktree, context, logs_output_id=None)
