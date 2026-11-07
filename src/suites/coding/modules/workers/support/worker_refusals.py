from core.base.command.context import Context
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worker_refusal_count import WorkerRefusalCount
from suites.coding.modules.workers.support.worker_nudges import WORKER_REFUSED, WORKER_REFUSAL_INTERVAL

REFUSAL_LIMIT_COUNT = 5


class WorkerRefusals:
    """Counts consecutive refused worker steps and tells the main agent when they keep failing."""

    def __init__(self, repository: Repository, main_agent_line: MergerInbox, queries: Queries) -> None:
        self.repository, self.main_agent_line, self.queries = repository, main_agent_line, queries

    def record(self, worktree: Worktree, context: Context) -> None:
        counts = self.read_count(worktree, context)
        counts = self.repository.save(counts.changed(count=counts.count + 1), context)
        if counts.count < REFUSAL_LIMIT_COUNT:
            return
        if counts.notice_at is not None and counts.notice_at.elapsed_seconds(context.timestamp) < WORKER_REFUSAL_INTERVAL.seconds:
            return
        notice = WORKER_REFUSED.nudge(worker=worktree.session_agent_id, count=counts.count, task=worktree.task_id)
        self.main_agent_line.send_nudge(notice, "workers.repeated-refusal", context)
        self.repository.save(counts.changed(notice_at=context.timestamp), context)

    def clear(self, worktree: Worktree, context: Context) -> None:
        counts = self.read_count(worktree, context)
        if counts.count == 0:
            return
        self.repository.save(counts.changed(count=0, notice_at=None), context)

    def read_count(self, worktree: Worktree, context: Context) -> WorkerRefusalCount:
        counted = self.queries.query(WorkerRefusalCount).filter(worktree_id=worktree.id).first()
        return counted if counted is not None else WorkerRefusalCount(worktree_id=worktree.id, creator_id=context.actor.id)
