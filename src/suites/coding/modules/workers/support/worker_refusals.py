from engine.cli.row_numbers import RowNumbers
from engine.command.context import Context
from engine.driver.count_down import CountDown
from engine.driver.time_window import TimeWindow
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.support.countdowns import Countdowns
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worker_refusal_count import WorkerRefusalCount
from suites.coding.modules.workers.agent_messages.worker_refusal_message import WORKER_REFUSAL_INTERVAL
from suites.coding.modules.workers.agent_messages.worker_refusal_message import WorkerRefusalMessage

REFUSAL_LIMIT_COUNT = 5
REFUSAL_COUNTDOWN = CountDown("workers.worker_refusal", "worker refusal", TimeWindow(REFUSAL_LIMIT_COUNT), is_silent=True)


class WorkerRefusals:
    """Counts consecutive refused worker steps and tells the main agent when they keep failing."""

    def __init__(self, repository: Repository, main_agent_line: MergerInbox, queries: Queries, countdowns: Countdowns, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.repository, self.main_agent_line, self.queries, self.countdowns = repository, main_agent_line, queries, countdowns

    def record(self, worktree: Worktree, context: Context, refusal_text: str | None = None) -> None:
        remaining = self.countdowns.tick(REFUSAL_COUNTDOWN, worktree.session_agent_id, str(worktree.id), context)
        refusal = self.read_refusal(worktree, context)
        refusal = self.repository.save(refusal.changed(refusal_text=refusal_text or refusal.refusal_text), context)
        if remaining > 0:
            return
        if refusal.notice_at is not None and refusal.notice_at.elapsed_seconds(context.timestamp) < WORKER_REFUSAL_INTERVAL.seconds:
            return
        count = self.countdowns.used_count(REFUSAL_COUNTDOWN, worktree.session_agent_id)
        notice = WorkerRefusalMessage.declared().agent_message(worker=self.numbers.agent_number(worktree.session_agent_id), count=count, task=worktree.task_id)
        self.main_agent_line.send_agent_message(notice, "workers.repeated-refusal", context)
        self.repository.save(refusal.changed(notice_at=context.timestamp), context)

    def clear(self, worktree: Worktree, context: Context) -> None:
        self.countdowns.reset(REFUSAL_COUNTDOWN, worktree.session_agent_id, context)
        refusal = self.read_refusal(worktree, context)
        if refusal.notice_at is None and refusal.refusal_text is None:
            return
        self.repository.save(refusal.changed(notice_at=None, refusal_text=None), context)

    def read_refusal(self, worktree: Worktree, context: Context) -> WorkerRefusalCount:
        kept = self.queries.query(WorkerRefusalCount).filter(worktree_id=worktree.id).first()
        return kept if kept is not None else WorkerRefusalCount(worktree_id=worktree.id, creator_id=context.actor.id)
