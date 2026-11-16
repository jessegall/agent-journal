from collections.abc import Sequence
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.driver.agent_message import AgentMessage
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.query.query import Query
from core.modules.agents.models.agent import Agent
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan_progress import PlanProgress
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.focus.plan_focus import PlanFocus
from core.modules.plans.agent_messages.checkpoint_reached_message import CheckpointReachedMessage
from core.modules.plans.agent_messages.phase_finished_message import PhaseFinishedMessage
from core.modules.plans.agent_messages.plan_stalled_message import PlanStalledMessage
from core.modules.tasks.models.enums.task_state import UNFINISHED_STATES, TaskState
from core.modules.tasks.queries.task_query import TaskQuery

BLOCKED_STATES = (TaskState.OPEN, TaskState.BLOCKED)
ACTIVE_STATES = (TaskState.STARTED, TaskState.TESTING)

class PlanTaskEndLines(EventLineSource):
    """A task the main agent has ended tells it the phase that ended, and a plan with nothing left that can
    start, with each task the plan waits on and who has it or what it waits on; the task now in hand is named
    by the return line of the tasks module, never twice. The end of a plan is told when the plan closes."""

    key = "plans.task-end-lines"
    events = [HookEventName.POST_TOOL_USE]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, queries: Queries, focus: PlanFocus, tasks: TaskQuery) -> None:
        self.queries, self.focus, self.tasks = queries, focus, tasks

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        shell = event.tool.shell if event.tool is not None else None
        numbers = shell.journal_command_numbers("task close", "task cancel", "task block", "task release") if shell is not None else ()
        listed = self.tasks.listed_tasks(numbers)
        ended = [task for task in listed if task.state is not TaskState.STARTED]
        if not ended:
            return []
        return [*(agent_message for task in ended for agent_message in self.plan_agent_messages(task.id, agent_id))]

    def plan_agent_messages(self, task_id: int, agent_id: int) -> list[AgentMessage]:
        place = self.queries.query(PlanTask).filter(task_id=task_id).first()
        if place is None:
            return []
        progress = self.queries.query(PlanProgress).find(place.plan_id)
        if progress.completed_count >= progress.task_count:
            return []
        agent_messages = self.phase_agent_messages(place)
        blocked_count = self.queries.query(PlanTask).filter(plan_id=place.plan_id).matching(Among("state", BLOCKED_STATES)).count()
        if not blocked_count or self.queries.query(PlanTask).filter(plan_id=place.plan_id).matching(Among("state", ACTIVE_STATES)).exists():
            return agent_messages
        overview = self.focus.overview(self.queries.query(Agent).find(agent_id))
        if not overview.has_ready_task(place.plan_id):
            waits = overview.waits_text(place.plan_id)
            agent_messages.append(PlanStalledMessage.declared().agent_message(plan=place.plan_id, count=blocked_count, waits=f": {waits}" if waits else ""))
        return agent_messages

    def phase_agent_messages(self, place: PlanTask) -> list[AgentMessage]:
        if self.unfinished("phase_id", place.phase_id).exists():
            return []
        phase = self.queries.query(Phase).find(place.phase_id)
        declaration = CheckpointReachedMessage.declared() if phase.checkpoint else PhaseFinishedMessage.declared()
        return [declaration.agent_message(plan=place.plan_id, phase=phase.title)]

    def unfinished(self, column: str, value: int) -> Query[PlanTask]:
        return self.queries.query(PlanTask).filter(**{column: value}).matching(Among("state", UNFINISHED_STATES))
