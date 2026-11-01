import re

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge import Nudge
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.query.query import Query
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan_progress import PlanProgress
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.next_plan_tasks import NextPlanTasks
from core.modules.plans.support.plan_nudges import CHECKPOINT_FINISHED, NEXT_TASK, PHASE_FINISHED, PLAN_FINISHED, PLAN_STALLED
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.rules.support.current_tasks import CurrentTasks

TASK_END_LINE = re.compile(r"(?:^|-- '|&& |; )journal task (?:close|cancel|block|release) (\d+)")
UNFINISHED_STATES = (TaskState.OPEN, TaskState.STARTED, TaskState.BLOCKED, TaskState.TESTING)


class PlanTaskLineRule(DriverRule):
    """A task the main agent has ended tells it the task now in hand with its brief, the phase or plan that ended,
    and a plan with nothing left that can start."""

    name = "plans.task-end-lines"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, current_tasks: CurrentTasks, plan_tasks: NextPlanTasks) -> None:
        self.queries, self.current_tasks, self.plan_tasks = queries, current_tasks, plan_tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        line = TASK_END_LINE.search(shell.line) if shell is not None else None
        if line is None:
            return RuleAnswer.allowed()
        task_id = int(line.group(1))
        if self.queries.query(Task).find(task_id).state is TaskState.STARTED:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(*self.plan_nudges(task_id), *self.next_task_nudges(hook.agent_id))

    def next_task_nudges(self, agent_id: int) -> list[Nudge]:
        current = self.current_tasks.current(agent_id)
        if current is None:
            return []
        places = self.queries.query(PlanTask).filter(task_id=current.task.id).page(1, 1).rows
        place = f" in plan {places[0].plan_id}" if places else ""
        return [NEXT_TASK.nudge(task=current.task.id, title=current.task.title, place=place, brief=current.task.brief or "no brief")]

    def plan_nudges(self, task_id: int) -> list[Nudge]:
        places = self.queries.query(PlanTask).filter(task_id=task_id).page(1, 1).rows
        if not places:
            return []
        place = places[0]
        progress = self.queries.query(PlanProgress).find(place.plan_id)
        if progress.completed_count >= progress.task_count:
            return [PLAN_FINISHED.nudge(plan=place.plan_id)]
        nudges = self.phase_nudges(place)
        unfinished_count = self.unfinished("plan_id", place.plan_id).count()
        if self.plan_tasks.following(place.plan_id) is None and unfinished_count:
            nudges.append(PLAN_STALLED.nudge(plan=place.plan_id, count=unfinished_count))
        return nudges

    def phase_nudges(self, place: PlanTask) -> list[Nudge]:
        if self.unfinished("phase_id", place.phase_id).exists():
            return []
        phase = self.queries.query(Phase).find(place.phase_id)
        declaration = CHECKPOINT_FINISHED if phase.checkpoint else PHASE_FINISHED
        return [declaration.nudge(plan=place.plan_id, phase=phase.title)]

    def unfinished(self, column: str, value: int) -> Query[PlanTask]:
        return self.queries.query(PlanTask).filter(**{column: value}).matching(Among("state", UNFINISHED_STATES))
