from typing import Callable
from datetime import datetime, timezone
from journal.db.connection import Connection
from journal.db.query import Query
from journal.events.bus import Bus
from journal.support.actor import Actor
from journal.models.link import Link
from journal.models.phase import Phase
from journal.models.plan import AGENT_PAUSER, Plan
from journal.models.plan_state import PlanState
from journal.support.rejection import Rejection
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.links import Links
from journal.repositories.phases import PHASE_TASK_LINK, Phases
from journal.repositories.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository
from journal.repositories.tasks import CLOSED_STATES, CURRENT_TASK_LINK, PLAN_LINK, WAIT_LINK, WORKERS, Tasks
from journal.repositories.templates import Templates
from journal.repositories.workers import Workers
from journal.models.phase_states import PhaseStates

TESTING_LINK = "testing"
# the title of the testing template that runs a plan's tests only at the end of each phase
PHASE_END_TESTS_TITLE = "Tests at each phase end"
from journal.models.support.ref import Ref
from journal.support.time_source import TimeSource


PHASE_LINK = "in_phase"
# the most tasks of one plan on offer at once
QUEUED_TASKS = 10


class Plans(ScopedRepository[Plan]):
    """The plans and their rows: tasks and phases in the order they were added, the plan's questions answered over them, and its writes: approve, start (a finished plan is done, else its next task is taken in hand, one at a time, else it waits for a task to open), postpone (its task in hand set aside, open again, first, so the plan's event comes last), cancel (with the tasks that are its alone). The open work is the open tasks of the approved and started plans that are neither blocked, delegated, queued nor in hand; a blocked task never stops the plan; the tasks it may take up next are open, the first in the plan's order first; a task joined its phase, then its tasks under no phase in the order they joined the plan, and the first phase holding one is found in one read."""

    model = Plan

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, links: Links, tasks: Tasks, phases: Phases, workers: Workers, templates: Templates, time_source: TimeSource) -> None:
        super().__init__(connection, bus, scope, time_source)
        self.links, self.tasks, self.phases, self.workers, self.templates = links, tasks, phases, workers, templates

    def user_approved(self, plan: Plan, actor: Actor, comment_id: int | None = None) -> Plan:
        return self.approval(plan, actor, lambda time: plan.user_approved(time, comment_id))

    def agent_approved(self, plan: Plan, actor: Actor) -> Plan:
        return self.approval(plan, actor, plan.agent_approved)

    def approval(self, plan: Plan, actor: Actor, approved: Callable[[float], Plan]) -> Plan:
        if plan.is_reviewing():
            raise Rejection(f"plan {plan.id} is in review: it can be approved once its reviewers are back and their findings are in it")
        if plan.state in (PlanState.STARTED, PlanState.FINISHED, PlanState.CANCELLED):
            return plan
        return self.save(approved(self._time().timestamp()), actor)

    def user_cancelled(self, plan: Plan, actor: Actor) -> list[Task]:
        return self.cancellation(plan, actor, plan.user_cancelled)

    def agent_cancelled(self, plan: Plan, actor: Actor) -> list[Task]:
        return self.cancellation(plan, actor, plan.agent_cancelled)

    def cancellation(self, plan: Plan, actor: Actor, cancelled_plan: Callable[[float], Plan]) -> list[Task]:
        self.save(cancelled_plan(self.time_source.moment().timestamp()), actor)
        cancelled = []
        for task in self.plan_tasks(plan):
            if task.is_closed() or self.is_shared(task, plan):
                continue
            cancelled.append(self.tasks.save(task.cancelled(self.time_source.moment(), f"its plan {plan.id} was cancelled"), actor))
        return cancelled

    def is_shared(self, task: Task, plan: Plan) -> bool:
        return any(ref.id != plan.id and self.find(ref.id).state != PlanState.CANCELLED for ref in self.links.targets(task, PLAN_LINK))

    def remove_task(self, plan: Plan, task: Task, actor: Actor) -> None:
        for link in [link for counterpart in [plan, *self.plan_phases(plan)] for link in self.links.connecting(task, counterpart)]:
            self.links.delete(link, actor)

    def plan_states(self, task: Task) -> set[PlanState]:
        return {plan.state for plan in self.containing(task)}

    def containing(self, task: Task) -> list[Plan]:
        return [plan for ref in self.links.targets(task, PLAN_LINK) if (plan := self.find(ref.id)).state in (PlanState.APPROVED, PlanState.STARTED, PlanState.PAUSED, PlanState.DELEGATED, PlanState.BLOCKED)]

    def waiting_plans(self, model) -> list[Plan]:
        return [plan for ref in self.links.sources(model, WAIT_LINK) if ref.type == Plan.table() and (plan := self.find(ref.id)).is_blocked()]

    def is_stalled(self, plan: Plan) -> bool:
        return plan.is_stalled(self.remaining_count(plan), self.tasks.counted(self.plan_task_query(plan).filter(state=TaskState.BLOCKED)))

    def remaining_count(self, plan: Plan) -> int:
        return self.tasks.counted(self.plan_task_query(plan).filter_unlisted("state", list(CLOSED_STATES)))

    def plan_task_query(self, plan: Plan) -> Query:
        planned = self.links.query().filter(link_type=PLAN_LINK, target=Ref.build(plan)).filter_ref("source", self.tasks.query())
        return self.tasks.query().filter_existing(planned)

    def task_count(self, plan: Plan) -> int:
        return self.tasks.counted(self.plan_task_query(plan))

    def open_work_count(self) -> int:
        return sum(self.unassigned_count(plan) for plan in (*self.approved(), *self.running_plans()))

    def unassigned_count(self, plan: Plan) -> int:
        return self.tasks.counted(self.plan_task_query(plan).filter(state=TaskState.OPEN, delegated=False))

    def blocked_count(self, plan: Plan) -> int:
        return self.tasks.counted(self.plan_task_query(plan).filter(state=TaskState.BLOCKED))

    def last_moved(self, plan: Plan) -> float:
        latest = self.tasks.selected(self.plan_task_query(plan).order_descending("updated_at").limit(1))
        return max(plan.updated_at, *(task.updated_at for task in latest)).timestamp()

    def plan_tasks(self, plan: Plan) -> list[Task]:
        return self.tasks.numbered(ref.id for ref in self.links.sources(plan, PLAN_LINK))

    def unphased_task_ids(self, plan: Plan, phased_ids: list[int]) -> list[int]:
        return [ref.id for ref in self.links.sources_except(plan, PLAN_LINK, [Ref(Task.table(), task_id) for task_id in phased_ids])]

    def recent_task_ids(self, plan: Plan, count: int) -> list[int]:
        return self.tasks.selected_ids(self.plan_task_query(plan).order_descending("updated_at").order_descending("id").limit(count))

    def assignable_tasks(self, task_ids: list[int]) -> list[Task]:
        assignable = {task.row_id: task for task in self.tasks.selected(self.tasks.query().filter_listed("id", task_ids).filter(state=TaskState.OPEN, delegated=False).filter_unequal("brief", ""))}
        return [assignable[n] for n in task_ids if n in assignable]

    def plan_task_ids(self, plan: Plan) -> list[int]:
        return [ref.id for ref in self.links.sources(plan, PLAN_LINK)]

    def phase_links(self, phases: list[Phase]) -> list[Link]:
        return self.links.model_links("target", phases, PHASE_LINK)

    def plan_phases(self, plan: Plan) -> list[Phase]:
        return self.phases.selected(self.plan_phase_query(plan).order("id"))

    def plan_phase_query(self, plan: Plan) -> Query:
        linked = self.links.query().filter(target=Ref.build(plan), link_type=PHASE_TASK_LINK).filter_ref("source", self.phases.query())
        return self.phases.query().filter_existing(linked)

    def phase_counts(self, plans: list[Plan]) -> dict[int, int]:
        return self.links.target_counts(plans, PHASE_TASK_LINK)

    def task_counts(self, plans: list[Plan]) -> dict[int, int]:
        return self.links.target_counts(plans, PLAN_LINK)

    def uncancelled_count(self, task_ids: list[int]) -> int:
        cancelled = self.tasks.counted(self.tasks.query().filter_listed("id", task_ids).filter(state=TaskState.CANCELLED)) if task_ids else 0
        return len(task_ids) - cancelled

    def unclosed_phase_tasks(self, phase: Phase) -> list[Task]:
        ids = [ref.id for ref in self.links.sources(phase, PHASE_LINK)]
        return self.tasks.selected(self.tasks.query().filter_listed("id", ids).filter_unlisted("state", [TaskState.COMPLETED, TaskState.CANCELLED]).order("id"))

    def phase_tasks(self, phase: Phase) -> list[Task]:
        return self.tasks.numbered(ref.id for ref in self.links.sources(phase, PHASE_LINK))

    def phase_states(self, plan: Plan) -> list[PhaseStates]:
        return [PhaseStates(number, phase, self.phase_state_counts(phase)) for number, phase in enumerate(self.plan_phases(plan), 1)]

    def phase_state_counts(self, phase: Phase) -> dict[TaskState, int]:
        members = self.links.query().filter(link_type=PHASE_LINK, target=Ref.build(phase)).filter_ref("source", self.tasks.query())
        return {TaskState(state): count for state, count in self.tasks.grouped_counts(self.tasks.query().filter_existing(members), "state").items()}

    def later_phase_task_ids(self) -> set[int]:
        later = [phase for plan in self.offering_plans() for phase in self.later_phases(plan)]
        return {task_id for task_ids in self.phase_task_ids(later).values() for task_id in task_ids}

    def later_phases(self, plan: Plan) -> list[Phase]:
        states = self.phase_states(plan)
        current = plan.current_phase(states)
        return [phase.phase for phase in states if phase.number > current]

    def phase_task_ids(self, phases: list[Phase]) -> dict[int, list[int]]:
        members: dict[int, list[int]] = {phase.id: [] for phase in phases}
        for link in self.phase_links(phases):
            members[link.target.id].append(link.source.id)
        return members

    def reviewing(self) -> list[Plan]:
        return self.matching(state=PlanState.REVIEWING)

    def reviewed(self) -> list[Plan]:
        return self.selected(self.query().filter(state=PlanState.REVIEWING, reviewers=0).order("id"))

    def agent_paused(self) -> list[Plan]:
        return self.matching(state=PlanState.PAUSED, pauser=AGENT_PAUSER)

    def approved(self) -> list[Plan]:
        return self.matching(state=PlanState.APPROVED)

    def related(self) -> list[Task]:
        started = [plan for plan in self.scoped() if plan.is_started()]
        if not started:
            return self.free()
        task = self.next_task(started[0])
        return [task] if task else []

    def stalled_plans(self, task: Task) -> list[Plan]:
        return [plan for plan in self.started_plans(task) if self.is_stalled(plan)]

    def complete_plans(self) -> list[Plan]:
        return [plan for plan in self.all() if plan.is_started() and self.finished(plan)]

    def running_plans(self) -> list[Plan]:
        return self.matching(state=PlanState.STARTED)

    def offering_plans(self) -> list[Plan]:
        """The plans whose open tasks go out to free places: the started ones and those handed to a worker, so a plan's other
        tasks in its phase at work run beside its worker's instead of waiting for it (19 Nov, Redmar: one worker doing all of a
        plan's work is no parallel strategy)."""
        return self.selected(self.query().filter_listed("state", [PlanState.STARTED, PlanState.DELEGATED]).order("id"))

    def allowing_test_runs(self) -> list[Plan]:
        return self.selected(self.query().filter(state=PlanState.STARTED).filter_greater("allowed_test_runs", 0))

    def running_plans_beside(self, plan_id: int) -> list[Plan]:
        return self.selected(self.query().filter(state=PlanState.STARTED).filter_unequal("id", plan_id))

    def finished_plans(self, task: Task) -> list[Plan]:
        return [plan for plan in self.containing(task) if self.finished(plan)]

    def loose_tasks(self, plan: Plan) -> list[Task]:
        phased = {task.id for phase in self.plan_phases(plan) for task in self.phase_tasks(phase)}
        return [task for task in self.plan_tasks(plan) if task.id not in phased]

    def has_phase_end_tests(self, task: Task) -> bool:
        templates = [ref.id for plan in self.working_plans(task) for ref in self.links.targets(plan, TESTING_LINK)]
        return bool(templates) and self.templates.has_titled(templates, PHASE_END_TESTS_TITLE)

    def working_plans(self, task: Task) -> list[Plan]:
        return [plan for ref in self.links.targets(task, PLAN_LINK) if (plan := self.find(ref.id)).state in (PlanState.STARTED, PlanState.PAUSED, PlanState.DELEGATED)]

    def started_plans(self, task: Task) -> list[Plan]:
        return [plan for plan in self.containing(task) if plan.is_started()]

    def unstarted_plans(self, task: Task) -> list[Plan]:
        return [plan for plan in self.containing(task) if plan.state in (PlanState.APPROVED, PlanState.PAUSED)]

    def resume_plan(self, plan: Plan, task: Task, actor: Actor) -> Plan:
        return self.save(plan.started(task, self.time_source.moment().timestamp()), actor)

    def unapproved(self, task: Task) -> list[Plan]:
        return [plan for ref in self.links.targets(task, PLAN_LINK) if (plan := self.find(ref.id)).state.is_unapproved()]

    def free(self) -> list[Task]:
        open_tasks = self.tasks.open_tasks()
        planned = {link.source.id for link in self.links.model_links("source", open_tasks, PLAN_LINK)}
        delegated = set(self.workers.containing({t.row_id for t in open_tasks}))
        return [t for t in open_tasks if t.id not in planned and t.id not in delegated]

    def finished(self, plan: Plan) -> bool:
        return plan.is_finished(self.tasks.counted(self.plan_task_query(plan)), self.remaining_count(plan))

    def has_agent_task(self, plan: Plan) -> bool:
        return self.tasks.counted(self.plan_task_query(plan).filter(state=TaskState.STARTED, delegated=False)) > 0

    def has_worker_task(self, plan: Plan) -> bool:
        return self.tasks.counted(self.plan_task_query(plan).filter(delegated=True).filter_unlisted("state", list(CLOSED_STATES))) > 0

    def started_task(self, plan: Plan) -> Task | None:
        started = self.tasks.selected(self.plan_task_query(plan).filter(state=TaskState.STARTED, delegated=False).order("id").limit(1))
        return started[0] if started else None

    def next_task(self, plan: Plan) -> Task | None:
        return self.first_task(plan, TaskState.OPEN, self.startable_tasks(plan))

    def startable_tasks(self, plan: Plan) -> Query:
        return self.tasks.query().filter(state=TaskState.OPEN, delegated=False).filter_unlisted("id", sorted(self.waiting_task_ids(plan))).filter_absent(self.worker_holdings())

    def queued_tasks(self, plan: Plan) -> list[Task]:
        queued: list[Task] = []
        while len(queued) < QUEUED_TASKS and (task := self.first_task(plan, TaskState.OPEN, self.startable_tasks(plan).filter_unlisted("id", [queued_task.row_id for queued_task in queued]))) is not None:
            queued.append(task)
        return queued

    def following_task(self, plan: Plan) -> Task | None:
        return self.first_planned(plan, self.startable_tasks(plan))

    def first_task(self, plan: Plan, state: TaskState, candidates: Query) -> Task | None:
        return self.first_planned(plan, candidates.filter(state=state))

    def first_planned(self, plan: Plan, matching: Query) -> Task | None:
        phase_links = self.links.query().filter(link_type=PHASE_LINK)
        task_links = phase_links.filter_ref("target", self.phases.query()).filter_existing(matching.filter_name_column(phase_links, "source"))
        first_phase = self.phases.selected(self.plan_phase_query(plan).filter_existing(task_links).order("id").limit(1))
        if first_phase:
            return self.first_link(phase_links.filter(target=Ref.build(first_phase[0])), matching)
        planned = phase_links.filter_existing(self.plan_phase_query(plan).filter_name_column(phase_links, "target"))
        unphased = matching.filter_absent(planned.filter_ref("source", self.tasks.query()))
        return self.first_link(self.links.query().filter(link_type=PLAN_LINK, target=Ref.build(plan)), unphased)

    def has_resumable(self, plan: Plan) -> bool:
        plan_links = self.links.query().filter(link_type=PLAN_LINK, target=Ref.build(plan))
        return self.has_link(plan_links, self.startable_tasks(plan))

    def has_link(self, links: Query, tasks: Query) -> bool:
        return bool(self.links.selected(links.filter_existing(tasks.filter_name_column(links, "source")).limit(1)))

    def first_link(self, links: Query, tasks: Query) -> Task | None:
        first = self.links.selected(links.filter_existing(tasks.filter_name_column(links, "source")).order("id").limit(1))
        return self.tasks.find(first[0].source.id) if first else None

    def waiting_task_ids(self, plan: Plan) -> set[int]:
        waits = self.links.query().filter(link_type=WAIT_LINK)
        return self.tasks.waiting_ids(self.tasks.selected(self.plan_task_query(plan).filter_existing(waits.filter_ref("source", self.tasks.query()))))

    def worker_holdings(self) -> Query:
        return self.links.query().filter(link_type=CURRENT_TASK_LINK).filter_prefix("source", f"{WORKERS}:").filter_ref("target", self.tasks.query())

    def checkpoint_plans(self, plan: Plan) -> PhaseStates | None:
        return plan.checkpoint_phase(self.phase_states(plan))

    def ended_phase(self, plan: Plan) -> PhaseStates | None:
        return plan.ended_phase(self.phase_states(plan))

    def phase_end_time(self, phase: Phase) -> float:
        return max(((task.completed_at or task.update_time).timestamp() for task in self.phase_tasks(phase)), default=0.0)

    def start(self, plan: Plan, holder: Ref | None, actor: Actor) -> Plan:
        time = self.time_source.moment()
        task = self.following_task(plan)
        if task is None or self.is_complete(plan):
            return self.opened(plan, actor)
        following = task.plan_started(time, plan.row_id)
        self.tasks.assign_holder(following, holder, actor)
        started = self.save(plan.started(task, time.timestamp()), actor)
        self.tasks.save(following, actor)
        return started

    def opened(self, plan: Plan, actor: Actor) -> Plan:
        time = self.time_source.moment().timestamp()
        return self.save(plan.finished(time) if self.is_complete(plan) else plan.started_without_task(time), actor)

    def is_complete(self, plan: Plan) -> bool:
        return plan.startable().is_finished(self.tasks.counted(self.plan_task_query(plan)), self.remaining_count(plan))

    def user_postponed(self, plan: Plan, actor: Actor) -> Plan:
        return self.postponement(plan, actor, plan.user_postponed)

    def agent_postponed(self, plan: Plan, actor: Actor) -> Plan:
        return self.postponement(plan, actor, plan.agent_postponed)

    def postponement(self, plan: Plan, actor: Actor, postponed_plan: Callable[[float], Plan]) -> Plan:
        time = self.time_source.moment()
        postponed = self.save(postponed_plan(time.timestamp()), actor)
        for task in self.tasks.selected(self.plan_task_query(plan).filter(state=TaskState.STARTED).order("id")):
            self.tasks.save(task.reopened(time), actor)
        return postponed
