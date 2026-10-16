from journal.db.connection import Connection
from journal.features.bus import Bus
from journal.models.actor import Actor
from journal.models.phase import Phase
from journal.models.plan import Plan
from journal.models.plan_state import PlanState
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.links import Links
from journal.repositories.phases import Phases
from journal.repositories.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository
from journal.repositories.tasks import Tasks

IN_PLAN = "in_plan"
PHASE_OF = "phase_of"
IN_PHASE = "in_phase"


class Plans(ScopedRepository[Plan]):
    model = Plan

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, links: Links, tasks: Tasks, phases: Phases) -> None:
        super().__init__(connection, bus, scope)
        self.links, self.tasks, self.phases = links, tasks, phases

    def approve(self, plan: Plan, by: Actor) -> Plan:
        """The user's word on a plan: approved from ready, and left as it is once started, so a second word cannot set a running plan back."""
        if plan.state in (PlanState.STARTED, PlanState.DONE, PlanState.CANCELLED):
            return plan
        return self.save(plan.approved(), by)

    def cancel(self, plan: Plan, by: Actor) -> list[Task]:
        """The plan cancelled with the tasks that are its alone: a task not done that another live plan also holds stays; the cancelled tasks are returned."""
        cancelled = []
        for task in self.tasks_of(plan):
            if task.state in (TaskState.DONE, TaskState.CANCELLED) or self.held_elsewhere(task, plan):
                continue
            cancelled.append(self.tasks.save(task.cancelled(), by))
        self.save(plan.cancelled(), by)
        return cancelled

    def held_elsewhere(self, task: Task, plan: Plan) -> bool:
        """Whether another plan that is not cancelled holds this task too."""
        return any(ref.id != plan.id and self.find(ref.id).state != PlanState.CANCELLED for ref in self.links.targets(task, IN_PLAN))

    def holding(self, task: Task) -> list[Plan]:
        """The started plans this task belongs to."""
        return [plan for ref in self.links.targets(task, IN_PLAN) if (plan := self.find(ref.id)).state == PlanState.STARTED]

    def tasks_of(self, plan: Plan) -> list[Task]:
        """In the order they were added."""
        return [self.tasks.find(ref.id) for ref in self.links.sources(plan, IN_PLAN)]

    def phases_of(self, plan: Plan) -> list[Phase]:
        """In the order they were added."""
        return [self.phases.find(ref.id) for ref in self.links.sources(plan, PHASE_OF)]

    def tasks_in(self, phase: Phase) -> list[Task]:
        return [self.tasks.find(ref.id) for ref in self.links.sources(phase, IN_PHASE)]

    def in_order(self, plan: Plan) -> list[Task]:
        """Phase by phase, then the tasks under no phase."""
        phased = [t for phase in self.phases_of(plan) for t in self.tasks_in(phase)]
        ids = {t.id for t in phased}
        return phased + [t for t in self.tasks_of(plan) if t.id not in ids]

    def free(self) -> list[Task]:
        """The open tasks an agent may take up on its own: a plan hands out its own in its order, so those are never offered."""
        return [t for t in self.tasks.in_state(TaskState.OPEN) if not self.links.targets(t, IN_PLAN)]

    def next_task(self, plan: Plan) -> Task | None:
        return next((t for t in self.in_order(plan) if t.state == TaskState.OPEN), None)

    def at_checkpoint(self, plan: Plan) -> Phase | None:
        """The checkpoint phase the plan stands at: complete, marked for the user's look, and the phase after it not yet begun; None when the plan stands at no checkpoint."""
        phases = self.phases_of(plan)
        for before, after in zip(phases, phases[1:]):
            done = self.tasks_in(before)
            coming = self.tasks_in(after)
            if before.checkpoint and done and all(t.state == TaskState.DONE for t in done) and coming and all(t.state == TaskState.OPEN for t in coming):
                return before
        return None
