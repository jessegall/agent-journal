from suites.coding.modules.workers.support.work_units import WorkUnits
from collections.abc import Mapping, Sequence

from engine.agent.agent_work import AgentWork
from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from engine.query.conditions.among import Among
from engine.time.timestamp import Timestamp
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.models.worker_work_review import WorkerWorkReview


class WorkerAgentWork(AgentWork):
    def __init__(self, queries: Queries, kept: KeptRows, units: WorkUnits, worktrees: WorktreeQuery) -> None:
        self.queries, self.kept, self.units, self.worktrees = queries, kept, units, worktrees

    def unit_names(self, agent_ids: Sequence[int]) -> Mapping[int, str]:
        working = self.worktrees.filter(removed_at=None).matching(Among("session_agent_id", list(agent_ids))).all_rows()
        working_ids = {worktree.session_agent_id for worktree in working}
        return {worker_id: self.units.unit(worker_id).card_name for worker_id in sorted(working_ids)}

    def last_merges(self, agent_ids: Sequence[int]) -> Mapping[int, Timestamp]:
        merged = {agent_id: self.worktrees.last_merged(agent_id) for agent_id in agent_ids}
        return {agent_id: worktree.merged_at for agent_id, worktree in merged.items() if worktree is not None and worktree.merged_at is not None}

    def pending(self) -> Mapping[int, str]:
        return self.kept.scoped_current(self.read, name="workers.pending_work")

    def read(self) -> Mapping[int, str]:
        return {row.agent_id: row.status for row in self.queries.query(WorkerWorkReview).all_rows()}
