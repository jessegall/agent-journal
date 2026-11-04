from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.usage.support.agent_move import AgentMove
from core.modules.usage.support.agent_plan import AgentPlan
from core.modules.usage.support.agent_task import AgentTask


@dataclass(frozen=True)
class AgentInspection:
    """What an agent's inspector shows beyond its row: who started it, its failed runs, its moves and its task."""

    agent_id: int
    starter_name: str
    last_activity: str
    failed_runs: int
    recent: tuple[AgentMove, ...]
    task: AgentTask | None
    plan: AgentPlan | None

    def json(self) -> Mapping[str, object]:
        return {"id": self.agent_id, "started_by": self.starter_name, "last_activity": self.last_activity, "failed_runs": self.failed_runs, "recent": [move.json() for move in self.recent],
                "task": self.task.json() if self.task else None, "plan": self.plan.json() if self.plan else None}
