from dataclasses import replace

from core.base.change.updated import Updated
from core.base.command.context import Context
from core.base.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.merger_line import MergerLine


class WorkerLogOutputListener(SaveListener[Updated[Output]]):
    """Marks worker logs read when the agent reads the whole saved output."""

    name = "workers.log-output"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Updated[Output], context: Context) -> None:
        if not event.row.has_new_full_read(event.old_row):
            return
        process = self.queries.query(Process).find(event.row.process_id)
        if process.session_agent_id != context.actor.id:
            return
        lines = self.queries.query(MergerLine).filter(read_output_id=process.id).all_rows()
        for line in lines:
            self.repository.save_change(line, replace(line, read_at=context.timestamp, read_output_id=None), context)
        worktrees = self.queries.query(Worktree).filter(logs_output_id=process.id, state=WorktreeState.DELIVERED).all_rows()
        for worktree in worktrees:
            self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.review_logs, logs_read_at=context.timestamp, logs_output_id=None), context)
