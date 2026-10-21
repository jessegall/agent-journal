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
from journal.repositories.tasks import WAIT_LINK, Tasks
from journal.repositories.workers import Workers
from journal.models.phase_tasks import PhaseTasks
from journal.models.plan_tree import PlanTree

PLAN_LINK = "in_plan"
PHASE_TASK_LINK = "phase_of"
PHASE_LINK = "in_phase"


class Plans(ScopedRepository[Plan]):
    """The plans and their rows: tasks and phases in the order they were added, the plan's questions answered over them, and its writes: approve, start (a finished plan is done, else its postponed or next task is taken in hand, one at a time, else it waits for a task to open), postpone (its task in hand postponed first, so the plan's event comes last), cancel (with the tasks that are its alone)."""

    model = Plan

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, links: Links, tasks: Tasks, phases: Phases, workers: Workers) -> None:
        super().__init__(connection, bus, scope)
        self.links, self.tasks, self.phases, self.workers = links, tasks, phases, workers

    def approve(self, plan: Plan, actor: Actor) -> Plan:
        if plan.state == PlanState.REVIEWING:
            raise Refused(f"plan {plan.id} is in review: it can be approved once its reviewers are back and their findings are in it")
        if plan.state in (PlanState.STARTED, PlanState.FINISHED, PlanState.CANCELLED):
            return plan
        return self.save(plan.approved(self._now().timestamp(), actor.is_the_user()), actor)

    def cancel(self, plan: Plan, actor: Actor) -> list[Task]:
        self.save(plan.cancelled(datetime.now(timezone.utc).timestamp(), actor.is_the_user()), actor)
        cancelled = []
        for task in self.tasks_of(plan):
            if task.is_closed() or self.is_in_another_plan(task, plan):
                continue
            cancelled.append(self.tasks.save(task.cancelled(datetime.now(timezone.utc)), actor))
        return cancelled

    def is_in_another_plan(self, task: Task, plan: Plan) -> bool:
        return any(ref.id != plan.id and self.find(ref.id).state != PlanState.CANCELLED for ref in self.links.targets(task, PLAN_LINK))

    def plan_states(self, task: Task) -> set[PlanState]:
        return {plan.state for plan in self.holding(task)}

    def holding(self, task: Task) -> list[Plan]:
        return [plan for ref in self.links.targets(task, PLAN_LINK) if (plan := self.find(ref.id)).state in (PlanState.APPROVED, PlanState.STARTED, PlanState.SUSPENDED, PlanState.BLOCKED)]

    def waiting_on(self, model) -> list[Plan]:
        return [plan for ref in self.links.sources(model, WAIT_LINK) if ref.type == Plan.table() and (plan := self.find(ref.id)).is_blocked()]

    def all_left_blocked(self, plan: Plan) -> bool:
        return plan.is_all_left_blocked(self.tasks_of(plan))

    def tasks_of(self, plan: Plan) -> list[Task]:
        return self.tasks.numbered(ref.id for ref in self.links.sources(plan, PLAN_LINK))

    def phases_of(self, plan: Plan) -> list[Phase]:
        return self.phases.numbered(ref.id for ref in self.links.sources(plan, PHASE_TASK_LINK))

    def tasks_in(self, phase: Phase) -> list[Task]:
        return self.tasks.numbered(ref.id for ref in self.links.sources(phase, PHASE_LINK))

    def phased(self, plan: Plan) -> list[PhaseTasks]:
        phases = self.phases_of(plan)
        links = self.links.linked("target", phases, PHASE_LINK)
        tasks = {task.id: task for task in self.tasks.numbered(link.source.id for link in links)}
        return [PhaseTasks(number, phase, tuple(tasks[link.source.id] for link in links if link.target.id == phase.id and link.source.id in tasks)) for number, phase in enumerate(phases, 1)]

    def tree(self, plan: Plan) -> PlanTree:
        return PlanTree(plan, tuple(self.tasks_of(plan)), tuple(self.phased(plan)))

    def in_order(self, plan: Plan) -> list[Task]:
        return self.tree(plan).in_order

    def in_review(self) -> list[Plan]:
        return self.matching(state=PlanState.REVIEWING)

    def approved(self) -> list[Plan]:
        return self.matching(state=PlanState.APPROVED)

    def related(self) -> list[Task]:
        started = [plan for plan in self.in_() if plan.state == PlanState.STARTED]
        if not started:
            return self.free()
        task = self.next_task(started[0])
        return [task] if task else []

    def free(self) -> list[Task]:
        open_tasks = self.tasks.in_state(TaskState.OPEN)
        planned = {link.source.id for link in self.links.linked("source", open_tasks, PLAN_LINK)}
        return [t for t in open_tasks if t.id not in planned]

    def finished(self, plan: Plan) -> bool:
        return plan.is_finished(self.tasks_of(plan))

    def cannot_start(self, plan: Plan) -> set[int]:
        return self.unstartable(self.tree(plan))

    def unstartable(self, tree: PlanTree) -> set[int]:
        return self.tasks.waiting_ids(list(tree.tasks)) | set(self.workers.holding({t.id for t in tree.tasks}))

    def resumable(self, plan: Plan) -> Task | None:
        return self.resumable_task(self.tree(plan))

    def resumable_task(self, tree: PlanTree) -> Task | None:
        return tree.plan.task_to_resume(tree.in_order, self.unstartable(tree))

    def started_task(self, plan: Plan) -> Task | None:
        return next((task for task in self.tasks_of(plan) if task.state == TaskState.STARTED), None)

    def next_task(self, plan: Plan) -> Task | None:
        return self.open_task(self.tree(plan))

    def open_task(self, tree: PlanTree) -> Task | None:
        return tree.plan.next_open_task(tree.in_order, self.unstartable(tree))

    def at_checkpoint(self, plan: Plan) -> PhaseTasks | None:
        return plan.checkpoint_at(self.phased(plan))

    def start(self, plan: Plan, actor: Actor) -> Plan:
        time = datetime.now(timezone.utc)
        tree = self.tree(plan)
        if plan.startable().is_finished(list(tree.tasks)):
            return self.save(plan.done(time.timestamp()), actor)
        task = self.resumable_task(tree)
        if task is None:
            return self.save(plan.started_without_task(time.timestamp()), actor)
        self.tasks.refuse_second(task.started(time))
        started = self.save(plan.started(task, time.timestamp()), actor)
        self.tasks.save(task.started_by_plan(time, plan.id), actor)
        return started

    def postpone(self, plan: Plan, actor: Actor) -> Plan:
        time = datetime.now(timezone.utc)
        for task in [t for t in self.tasks_of(plan) if t.state == TaskState.STARTED]:
            self.tasks.save(task.parked(f"plan {plan.id} was parked", time), actor)
        return self.save(plan.postponed(time.timestamp(), actor.is_the_user()), actor)
