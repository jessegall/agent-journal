import json
from dataclasses import dataclass

from core.modules.plans.models.plan_card import PlanCard
from core.modules.plans.support.plan_agent import PlanAgent
from core.modules.plans.support.plan_board_json_record import PlanBoardJsonRecord
from core.modules.plans.support.plan_card_json_record import PlanCardJsonRecord


@dataclass(frozen=True)
class PlanBoard:
    """What the plans window draws: how many plans are open, started and closed, and the page of cards of the side
    asked for."""

    open_total: int
    started_total: int
    closed_total: int
    plans: tuple[PlanCard, ...]

    def json(self) -> PlanBoardJsonRecord:
        return {"open_total": self.open_total, "started_total": self.started_total, "closed_total": self.closed_total, "plans": [self.card_json(plan) for plan in self.plans]}

    @staticmethod
    def card_json(plan: PlanCard) -> PlanCardJsonRecord:
        agents = PlanAgent.listed(plan.agents)
        return {"id": plan.id, "title": plan.title, "state": plan.state.value, "task_count": plan.task_count, "completed_count": plan.completed_count, "testing_count": plan.testing_count,
                "current_phase": plan.current_phase, "delegated": bool(agents), "agents": [agent.json() for agent in agents],
                "working": json.loads(plan.working)}
