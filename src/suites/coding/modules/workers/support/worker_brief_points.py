from collections.abc import Mapping, Sequence

from engine.agent.agent_brief_points import AgentBriefPoints
from engine.query.queries import Queries
from suites.coding.modules.workers.models.worker_points import WorkerPoints
from suites.coding.modules.workers.support.worker_point_list import WorkerPointList


class WorkerBriefPoints(AgentBriefPoints):
    """The points of the brief of a worker's newest worktree's task."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def brief_points(self, agent_id: int) -> Sequence[Mapping[str, object]]:
        return WorkerPointList(self.queries.query(WorkerPoints).filter(session_agent_id=agent_id).descending("worktree_id").first()).points()
