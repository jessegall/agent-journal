from collections.abc import Sequence

from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from engine.scope.actor_scope import ActorScope
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.plans.support.focus.focus_overview import FocusOverview
from core.modules.plans.support.focus.plan_focus import PlanFocus
from core.modules.plans.support.focus.plan_work import PlanWork
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery


class FocusedPlanTasks:
    """Picks the task an agent takes next for its plan focus: a ready task of the focused plan or an open task
    the plan waits on, whichever the most plan tasks wait on. Only tasks the agent may take are picked. It
    reads every row of the agent's environment, whatever the scope of its caller, so a task reserved for
    nobody is seen. An agent with no focus is given nothing. It can also go on to the started plans that are
    not the focus, oldest first, and pick the next task of the first one that has a task reserved for nobody."""

    def __init__(self, focus: PlanFocus, tasks: TaskQuery, scopes: Scopes) -> None:
        self.focus, self.tasks, self.scopes = focus, tasks, scopes

    def first(self, agent: Agent, excluded_id: int | None = None) -> Task | None:
        with self.scopes.opened(agent.id, agent.environment_id, [ActorScope]):
            return self.focus_task(agent, self.focus.overview(agent), excluded_id)

    def first_started(self, agent: Agent, excluded_id: int | None = None) -> Task | None:
        with self.scopes.opened(agent.id, agent.environment_id, [ActorScope]):
            overview = self.focus.overview(agent)
            return self.focus_task(agent, overview, excluded_id) or self.free_task(overview.remaining, excluded_id)

    def focus_task(self, agent: Agent, overview: FocusOverview, excluded_id: int | None) -> Task | None:
        work = overview.focus_work
        task_ids = [] if work is None else [task_id for task_id in work.task_ids() if task_id != excluded_id]
        if work is None or not task_ids:
            return None
        return work.first(self.tasks.takeable(agent).matching(Among("id", task_ids)).all_rows())

    def free_task(self, plans: Sequence[PlanWork], excluded_id: int | None) -> Task | None:
        for work in plans:
            task_ids = [task_id for task_id in work.ready_task_ids() if task_id != excluded_id]
            free = work.most_urgent(self.tasks.matching(IsNull("delegated_to")).matching(Among("id", task_ids)).all_rows()) if task_ids else None
            if free is not None:
                return free
        return None
