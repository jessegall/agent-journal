from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.nudge import Nudge
from engine.driver.rule_answer import RuleAnswer
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.query.query import Query
from core.modules.agents.models.agent import Agent
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan_progress import PlanProgress
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.focus.plan_focus import PlanFocus
from core.modules.plans.support.plan_nudges import CHECKPOINT_FINISHED, PHASE_FINISHED, PLAN_FINISHED, PLAN_STALLED
from core.modules.tasks.models.enums.task_state import UNFINISHED_STATES, TaskState
from core.modules.tasks.models.task import Task

BLOCKED_STATES = (TaskState.OPEN, TaskState.BLOCKED)
ACTIVE_STATES = (TaskState.STARTED, TaskState.TESTING)


class PlanTaskLineRule(DriverRule):
    """A task the main agent has ended tells it the phase or plan that ended, and a plan with nothing left that
    can start, with each task the plan waits on and who has it or what it waits on; the task now in hand is
    named by the return line of the tasks module, never twice."""

    name = "plans.task-end-lines"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, focus: PlanFocus) -> None:
        self.queries, self.focus = queries, focus

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        numbers = shell.journal_command_numbers("task close", "task cancel", "task block", "task release") if shell is not None else ()
        ended = [task for task in self.queries.query(Task).find_many(numbers) if task.state is not TaskState.STARTED]
        if not ended:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(*(nudge for task in ended for nudge in self.plan_nudges(task.id, hook.agent_id)))

    def plan_nudges(self, task_id: int, agent_id: int) -> list[Nudge]:
        place = self.queries.query(PlanTask).filter(task_id=task_id).first()
        if place is None:
            return []
        progress = self.queries.query(PlanProgress).find(place.plan_id)
        if progress.completed_count >= progress.task_count:
            return [PLAN_FINISHED.nudge(plan=place.plan_id)]
        nudges = self.phase_nudges(place)
        blocked_count = self.queries.query(PlanTask).filter(plan_id=place.plan_id).matching(Among("state", BLOCKED_STATES)).count()
        if not blocked_count or self.queries.query(PlanTask).filter(plan_id=place.plan_id).matching(Among("state", ACTIVE_STATES)).exists():
            return nudges
        overview = self.focus.overview(self.queries.query(Agent).find(agent_id))
        if not overview.has_ready_task(place.plan_id):
            waits = overview.waits_text(place.plan_id)
            nudges.append(PLAN_STALLED.nudge(plan=place.plan_id, count=blocked_count, waits=f": {waits}" if waits else ""))
        return nudges

    def phase_nudges(self, place: PlanTask) -> list[Nudge]:
        if self.unfinished("phase_id", place.phase_id).exists():
            return []
        phase = self.queries.query(Phase).find(place.phase_id)
        declaration = CHECKPOINT_FINISHED if phase.checkpoint else PHASE_FINISHED
        return [declaration.nudge(plan=place.plan_id, phase=phase.title)]

    def unfinished(self, column: str, value: int) -> Query[PlanTask]:
        return self.queries.query(PlanTask).filter(**{column: value}).matching(Among("state", UNFINISHED_STATES))
