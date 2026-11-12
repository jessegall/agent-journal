from suites.coding.modules.workers.support.work_units import WorkUnits
from collections.abc import Mapping, Sequence

from engine.agent.agent_work import AgentWork
from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from engine.query.conditions.among import Among
from engine.agent.merged_work import MergedWork
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.models.worker_work_review import WorkerWorkReview

WORK_REASON = "the agent cards name the work of every worker with a worktree"


class WorkerAgentWork(AgentWork):
    def __init__(self, queries: Queries, kept: KeptRows, units: WorkUnits, worktrees: WorktreeQuery) -> None:
        self.queries, self.kept, self.units, self.worktrees = queries, kept, units, worktrees

    def unit_names(self, agent_ids: Sequence[int]) -> Mapping[int, str]:
        working = self.worktrees.filter(removed_at=None).matching(Among("session_agent_id", list(agent_ids))).every_row(WORK_REASON)
        working_ids = {worktree.session_agent_id for worktree in working}
        return {worker_id: self.units.unit(worker_id).card_name for worker_id in sorted(working_ids)}

    def merged_work(self, agent_ids: Sequence[int]) -> Mapping[int, MergedWork]:
        worktrees = self.worktrees.merged_among(list(agent_ids))
        return {agent_id: MergedWork(max((worktree.merged_at for worktree in mine if worktree.merged_at is not None), default=None), frozenset(task_id for worktree in mine for task_id in worktree.merged_tasks()))
                for agent_id in agent_ids if (mine := [worktree for worktree in worktrees if worktree.session_agent_id == agent_id])}

    def pending(self) -> Mapping[int, str]:
        return self.kept.scoped_current(self.read, name="workers.pending_work")

    def read(self) -> Mapping[int, str]:
        return {row.agent_id: row.status for row in self.queries.query(WorkerWorkReview).every_row(WORK_REASON)}
