from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.agents.models.agent import MAIN_ROLE, Agent
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.enums.waiting_reason import WaitingReason
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.unblockers.waiting_line import WaitingLine
from core.modules.plans.support.plan_task_order import WORKING_STATES
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_wait import TaskWait

FOLLOWED_STATES = (PlanState.APPROVED, PlanState.STARTED)
UNAPPROVED_STATES = (PlanState.DRAFT, PlanState.READY)
PERSON_TARGET = "user"
HOLDER_STATES = (TaskState.STARTED, TaskState.TESTING)


@dataclass(frozen=True)
class UnblockerFacts:
    """Everything read about the tasks at the end of a plan's waits, for one asking agent. It says for each of
    them why it cannot be handed out to that agent, or that it can."""

    asker: Agent
    takeable_ids: frozenset[int]
    places: Mapping[int, PlanTask]
    plans: Mapping[int, Plan]
    plan_rows: Mapping[int, Sequence[PlanTask]]
    waits: Mapping[int, Sequence[TaskWait]]
    agents: Mapping[int, Agent]

    def waiting_line(self, task: Task) -> WaitingLine | None:
        if task.state in HOLDER_STATES:
            return self.holder_line(task)
        if task.state is TaskState.BLOCKED:
            return WaitingLine(task.id, WaitingReason.NON_TASK_WAIT, self.wait_text(self.waits.get(task.id, ())))
        if task.id not in self.takeable_ids:
            return WaitingLine(task.id, WaitingReason.ANOTHER_ASSIGNEE, self.assignee_text(task))
        place = self.places.get(task.id)
        return None if place is None else self.plan_line(task, place)

    def holder_line(self, task: Task) -> WaitingLine:
        holder = self.agents.get(task.holder_id) if task.holder_id is not None else None
        if holder is None:
            return WaitingLine(task.id, WaitingReason.ANOTHER_HOLDER, "which is started")
        if self.is_asker(holder):
            return WaitingLine(task.id, WaitingReason.ASKER_HOLDER, "which you hold")
        return WaitingLine(task.id, WaitingReason.ANOTHER_HOLDER, f"which {AgentLabel.from_agent(holder).text} holds")

    def is_asker(self, agent: Agent) -> bool:
        return agent.id == self.asker.id or agent.role == MAIN_ROLE == self.asker.role

    @staticmethod
    def wait_text(waits: Sequence[TaskWait]) -> str:
        if any(wait.target == PERSON_TARGET for wait in waits):
            return "which waits on a person"
        if any(wait.command for wait in waits):
            return "which waits on a command"
        return "which waits on something that is no task" if waits else "which is blocked with a reason"

    def assignee_text(self, task: Task) -> str:
        assignee = self.agents.get(task.delegated_to) if task.delegated_to is not None else None
        return "which is not assigned to you" if assignee is None else f"which is reserved for {AgentLabel.from_agent(assignee).text}"

    def plan_line(self, task: Task, place: PlanTask) -> WaitingLine | None:
        plan = self.plans[place.plan_id]
        if plan.state in UNAPPROVED_STATES:
            return WaitingLine(task.id, WaitingReason.UNAPPROVED_PLAN, f"which is in plan {plan.id}, a plan nobody approved")
        if plan.state not in FOLLOWED_STATES:
            return WaitingLine(task.id, WaitingReason.UNAPPROVED_PLAN, f"which is in plan {plan.id}, a plan that is {plan.state.value}")
        rows = self.plan_rows[plan.id]
        checkpoint = min((row for row in rows if row.checkpoint and row.closed_at is None), key=lambda row: row.phase_position, default=None)
        if checkpoint is not None and place.phase_position > checkpoint.phase_position:
            return WaitingLine(task.id, WaitingReason.CHECKPOINT, f"which is behind the checkpoint phase {checkpoint.phase_id} of plan {plan.id}")
        if place.phase_position > min(row.phase_position for row in rows if row.state in WORKING_STATES):
            return WaitingLine(task.id, WaitingReason.LATER_PHASE, f"which is in a later phase of plan {plan.id}")
        return None
