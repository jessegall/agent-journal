from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit_listener import CommitListener
from core.modules.plans.listeners.support.task_plan_preparation import TaskPlanPreparation
from engine.listener.event_rows import EventRows
from core.modules.agents.models.agent import MAIN_ROLE, Agent
from core.modules.plans.support.focus.focused_plan_tasks import FocusedPlanTasks
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.support.next_plan_tasks import NextPlanTasks
from core.modules.plans.support.task_plans import TaskPlans
from core.modules.tasks.commands.start_task.start_task import StartTask
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.support.suite_task_assigners import SuiteTaskAssigners
from core.modules.tasks.models.support.task_priority import URGENT_PRIORITY
from engine.event.moved import Moved
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task


class NextPlanTaskStarterListener(TaskPlanPreparation, CommitListener[Moved[Task]]):
    """When a task of a started plan that the main agent held is closed, the next task of that agent's plan
    focus is started for it, never past a checkpoint phase that still has an open task. The focus can be
    another plan than the plan of the closed task. Nothing is started for any agent but the main agent: an
    agent of a suite takes its next task through that suite. A suite with no task assigner hands out
    nothing."""

    name = "plans.next-plan-task-starter"
    moves = tuple([TaskLifecycle.close])

    def __init__(self, bus: Bus, next_tasks: NextPlanTasks, tasks: TaskQuery, assigners: SuiteTaskAssigners, plans: TaskPlans, focused: FocusedPlanTasks, rows: EventRows) -> None:
        self.bus, self.next_tasks, self.tasks, self.assigners, self.plans = bus, next_tasks, tasks, assigners, plans
        self.focused, self.rows = focused, rows

    def handle(self, event: Moved[Task], logged: LoggedEvent) -> None:
        plan = self.plans.find(event.row.id)
        assigner = self.assigners.assigner()
        holder_id = None if event.old_row is None else event.old_row.holder_id
        if plan is None or assigner is None or holder_id is None or plan.state is not PlanState.STARTED:
            return
        holder = self.rows.required(Agent, holder_id)
        if holder.role != MAIN_ROLE or holder.ended_at is not None or self.tasks.holder(holder_id).started().exists():
            return
        if self.urgent_task_waits() or assigner.exceeds_context_limit(holder_id):
            return
        following = self.focused.first(holder)
        if following is not None:
            self.bus.run(StartTask(following.id), Actor(holder_id, ActorType.AGENT), cause_id=logged.id)

    def urgent_task_waits(self) -> bool:
        most_urgent = self.tasks.next_open(None, self.next_tasks.plan_exclusion())
        return most_urgent is not None and most_urgent.priority >= URGENT_PRIORITY
