from engine.query.conditions.among import Among
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.messages.models.message import Message
from suites.coding.modules.workers.models.enums.ask_outcome import AskOutcome
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery

WRITERS_REASON = "every message to the worker since its question was forwarded names who answered"


SETTLED_OUTCOMES = (AskOutcome.ANSWERED, AskOutcome.FIXED, AskOutcome.MOOT)


class Escalations:
    """Whether the main agent already has a worker's question. It has one from the moment a question of the
    worker was forwarded until the main agent writes to the worker, a later question of the worker is
    answered, fixed or moot, or the worker's worktree is closed."""

    def __init__(self, queries: Queries, worktrees: WorktreeQuery) -> None:
        self.queries, self.worktrees = queries, worktrees

    def forwarded_line(self, worker_id: int) -> MergerLine | None:
        return self.queries.query(MergerLine).filter(worker_id=worker_id, outcome=AskOutcome.FORWARDED).newest().first()

    def is_open(self, worker_id: int) -> bool:
        return self.open_line(worker_id) is not None

    def open_line(self, worker_id: int) -> MergerLine | None:
        line = self.forwarded_line(worker_id)
        if line is None or line.closed_at is None or self.worktrees.worker_worktree(worker_id) is None:
            return None
        if self.queries.query(MergerLine).filter(worker_id=worker_id).matching(Greater("id", line.id)).matching(Among("outcome", SETTLED_OUTCOMES)).exists():
            return None
        writer_ids = [message.creator_id for message in self.queries.query(Message).filter(target_agent_id=worker_id).matching(Greater("created_at", line.closed_at.text)).every_row(WRITERS_REASON)]
        if not writer_ids:
            return line
        return None if any(agent.id in writer_ids for agent in MainAgentFinder.rows(self.queries)) else line
