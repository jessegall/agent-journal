from engine.command.context import Context
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from engine.driver.nudger import Nudger
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_wait import PlanWait
from core.modules.plans.support.plan_assignee import PlanAssignee
from core.modules.plans.support.plan_nudges import PLAN_OPENED

WAIT_ENDED_SOURCE = "plans.wait-ended"


class PlanWaits:
    """Ends the waits on a plan that has ended, opens each blocked plan whose last wait that was, and tells
    the main agent."""

    def __init__(self, queries: Queries, repository: Repository, nudger: Nudger) -> None:
        self.queries, self.repository, self.nudger = queries, repository, nudger

    def open_waits(self, plan_id: int) -> tuple[PlanWait, ...]:
        return tuple(self.queries.query(PlanWait).filter(plan_id=plan_id).matching(IsNull("ended_at")).all_rows())

    def blocker_waits(self, blocker_id: int) -> tuple[PlanWait, ...]:
        return tuple(self.queries.query(PlanWait).filter(blocker_id=blocker_id).matching(IsNull("ended_at")).all_rows())

    def reaches(self, plan_id: int, target_id: int) -> bool:
        visited: set[int] = set()
        waiting = [plan_id]
        while waiting:
            current = waiting.pop()
            if current == target_id:
                return True
            if current not in visited:
                visited.add(current)
                waiting += [wait.blocker_id for wait in self.open_waits(current)]
        return False

    def ended(self, plan: Plan, context: Context) -> None:
        ended = self.blocker_waits(plan.id)
        for wait in ended:
            self.repository.update(wait, context, ended_at=context.timestamp)
        waiting_plans = self.queries.query(Plan).find_many(list(dict.fromkeys(wait.plan_id for wait in ended)))
        for waiting in waiting_plans:
            if waiting.state is not PlanState.BLOCKED or self.open_waits(waiting.id):
                continue
            self.repository.save_change(waiting, waiting.moved(PlanLifecycle.unblock), context)
            self.notify_main_agents(waiting, context)

    def end_open_waits(self, plan: Plan, context: Context) -> None:
        for wait in self.open_waits(plan.id):
            self.repository.update(wait, context, ended_at=context.timestamp)

    def notify_main_agents(self, plan: Plan, context: Context) -> None:
        assignee_id = PlanAssignee.agent_id(plan)
        for agent in MainAgentFinder.rows(self.queries):
            if assignee_id in (None, agent.id):
                self.nudger.send(agent.id, PLAN_OPENED, WAIT_ENDED_SOURCE, context, plan=plan.id)
