from core.base.agent_role import AgentRole
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.plan_outline import OutlinePhase, OutlineTask, PlanOutline
from core.modules.tasks.models.task import Task


class PlanOutlines:
    """Reads a plan's phases and tasks in order."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def of(self, plan_id: int) -> PlanOutline:
        places = tuple(self.queries.query(PlanTask).filter(plan_id=plan_id).ordered("phase_position", "position").all_rows())
        tasks = {task.id: task for task in self.queries.query(Task).find_many([place.task_id for place in places])}
        phases = tuple(self.queries.query(Phase).filter(plan_id=plan_id).ordered("position").all_rows())
        holders = {task.holder_id for task in tasks.values() if task.holder_id is not None}
        workers = {agent.id for agent in self.queries.query(Agent).filter(role=AgentRole.WORKER).matching(Among("id", tuple(holders))).all_rows()} if holders else set()
        return PlanOutline(plan_id, tuple(OutlinePhase(phase.id, phase.title, phase.goal, tuple(OutlineTask(place.task_id, tasks[place.task_id].title, place.state.value, tasks[place.task_id].holder_id if tasks[place.task_id].holder_id in workers else None) for place in places if place.phase_id == phase.id), phase.checkpoint)
                                          for phase in phases))
