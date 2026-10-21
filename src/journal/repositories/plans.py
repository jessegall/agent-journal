from datetime import datetime, timezone
from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.support.actor import Actor
from journal.models.phase import Phase
from journal.models.plan import Plan
from journal.models.plan_state import PlanState
from journal.support.refused import Refused
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.links import Links
from journal.repositories.phases import Phases
from journal.support.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository
from journal.repositories.tasks import WAITS_ON, Tasks
from journal.repositories.workers import Workers
from journal.models.phase_tasks import PhaseTasks

IN_PLAN = "in_plan"
PHASE_OF = "phase_of"
IN_PHASE = "in_phase"


class Plans(ScopedRepository[Plan]):
    """The plans and their rows: tasks and phases in the order they were added, the plan's questions answered over them, and its writes: approve, start (a finished plan is done, else its postponed or next task is taken in hand, one at a time, else it waits for a task to open), postpone (its task in hand postponed first, so the plan's event comes last), cancel (with the tasks that are its alone)."""

    model = Plan

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, links: Links, tasks: Tasks, phases: Phases, workers: Workers) -> None:
        super().__init__(connection, bus, scope)
        self.links, self.tasks, self.phases, self.workers = links, tasks, phases, workers

    def approve(self, plan: Plan, by: Actor) -> Plan:
        if plan.state == PlanState.REVIEWING:
            raise Refused(f"plan {plan.id} is in review: it can be approved once its reviewers are back and their findings are in it")
        if plan.state in (PlanState.STARTED, PlanState.DONE, PlanState.CANCELLED):
            return plan
        return self.save(plan.approved(self._now().timestamp(), by.is_the_user()), by)

    def cancel(self, plan: Plan, by: Actor) -> list[Task]:
        cancelled = []
        for task in self.tasks_of(plan):
            if task.is_closed() or self.is_in_another_plan(task, plan):
                continue
            cancelled.append(self.tasks.save(task.cancelled(datetime.now(timezone.utc)), by))
        self.save(plan.cancelled(datetime.now(timezone.utc).timestamp(), by.is_the_user()), by)
        return cancelled

    def is_in_another_plan(self, task: Task, plan: Plan) -> bool:
        return any(ref.id != plan.id and self.find(ref.id).state != PlanState.CANCELLED for ref in self.links.targets(task, IN_PLAN))

    def holding(self, task: Task) -> list[Plan]:
        return [plan for ref in self.links.targets(task, IN_PLAN) if (plan := self.find(ref.id)).state in (PlanState.APPROVED, PlanState.STARTED, PlanState.PARKED, PlanState.BLOCKED)]

    def waiting_on(self, model) -> list[Plan]:
        return [plan for ref in self.links.sources(model, WAITS_ON) if ref.type == Plan.table() and (plan := self.find(ref.id)).is_blocked()]

    def all_left_blocked(self, plan: Plan) -> bool:
        return plan.is_all_left_blocked(self.tasks_of(plan))

    def tasks_of(self, plan: Plan) -> list[Task]:
        return self.tasks.numbered(ref.id for ref in self.links.sources(plan, IN_PLAN))

    def phases_of(self, plan: Plan) -> list[Phase]:
        return self.phases.numbered(ref.id for ref in self.links.sources(plan, PHASE_OF))

    def tasks_in(self, phase: Phase) -> list[Task]:
        return self.tasks.numbered(ref.id for ref in self.links.sources(phase, IN_PHASE))

    def phased(self, plan: Plan) -> list[PhaseTasks]:
        return [PhaseTasks(number, phase, tuple(self.tasks_in(phase))) for number, phase in enumerate(self.phases_of(plan), 1)]

    def in_order(self, plan: Plan) -> list[Task]:
        return plan.in_order(self.phased(plan), self.tasks_of(plan))

    def in_review(self) -> list[Plan]:
        return self.where(state=PlanState.REVIEWING)

    def approved(self) -> list[Plan]:
        return self.where(state=PlanState.APPROVED)

    def related(self) -> list[Task]:
        started = [plan for plan in self.in_() if plan.state == PlanState.STARTED]
        if not started:
            return self.free()
        task = self.next_task(started[0])
        return [task] if task else []

    def free(self) -> list[Task]:
        return [t for t in self.tasks.in_state(TaskState.OPEN) if not self.links.targets(t, IN_PLAN)]

    def finished(self, plan: Plan) -> bool:
        return plan.is_finished(self.tasks_of(plan))

    def cannot_start(self, plan: Plan) -> set[int]:
        tasks = self.tasks_of(plan)
        waiting = {t.id for t in tasks if self.tasks.open_waits(t)}
        return waiting | set(self.workers.holding({t.id for t in tasks}))

    def resumable(self, plan: Plan) -> Task | None:
        return plan.task_to_resume(self.in_order(plan), self.cannot_start(plan))

    def started_task(self, plan: Plan) -> Task | None:
        return next((task for task in self.tasks_of(plan) if task.state == TaskState.STARTED), None)

    def next_task(self, plan: Plan) -> Task | None:
        return plan.next_open_task(self.in_order(plan), self.cannot_start(plan))

    def at_checkpoint(self, plan: Plan) -> PhaseTasks | None:
        return plan.checkpoint_at(self.phased(plan))

    def start(self, plan: Plan, by: Actor) -> Plan:
        time = datetime.now(timezone.utc)
        if plan.startable().is_finished(self.tasks_of(plan)):
            return self.save(plan.done(time.timestamp()), by)
        task = self.resumable(plan)
        if task is None:
            return self.save(plan.started_without_task(time.timestamp()), by)
        self.tasks.refuse_second(task.started(time))
        started = self.save(plan.started(task, time.timestamp()), by)
        self.tasks.save(task.started_by_plan(time, plan.id), by)
        return started

    def postpone(self, plan: Plan, by: Actor) -> Plan:
        time = datetime.now(timezone.utc)
        for task in [t for t in self.tasks_of(plan) if t.state == TaskState.STARTED]:
            self.tasks.save(task.parked(f"plan {plan.id} was parked", time), by)
        return self.save(plan.postponed(time.timestamp(), by.is_the_user()), by)
