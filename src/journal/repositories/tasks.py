from journal.db.connection import Connection
from journal.db.query import Query
from journal.events.bus import Bus
from journal.models.agent import Agent
from journal.models.check import Check
from journal.models.link import Link
from journal.models.plan import Plan
from journal.models.question import Question
from journal.models.support.ref import Ref
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.models.plan_state import PlanState
from journal.support.actor import Actor
from journal.support.rejection import Rejection
from journal.repositories.checks import Checks
from journal.repositories.links import Links
from journal.repositories.questions import Questions
from journal.repositories.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository

WAIT_LINK = "waits_on"
CURRENT_TASK_LINK = "in_hand"
WORKERS = "workers"
WORKER_TASK = "task {task} is not worker {worker}'s: a worker works on the task it holds, {holdings}"
HOLDER_REFUSAL = "task {task} is held by worker {worker} until its work is merged or released: send that worker its next job, or release it first"
PLAN_LINK = "in_plan"
USER_PREFIX = "user:"
CLOSED = (TaskState.FINISHED, TaskState.CANCELLED)


UNAPPROVED_PLAN_STATES = tuple(state.value for state in PlanState if state.is_unapproved())


class Tasks(ScopedRepository[Task]):
    model = Task

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, links: Links, questions: Questions, checks: Checks) -> None:
        super().__init__(connection, bus, scope)
        self.links, self.checks = links, checks
        self.awaitable: dict[str, Tasks | Questions | Checks] = {Task.table(): self, Question.table(): questions, Check.table(): checks}

    def open_waits(self, row: Task | Plan) -> list[Ref]:
        return [ref for ref in self.links.targets(row, WAIT_LINK) if not self.waiting(ref).is_resolved()]

    def waits_reach(self, start: Ref, goal: Ref) -> bool:
        viewed, todo = set(), [start]
        while todo:
            ref = todo.pop()
            if ref == goal:
                return True
            if ref in viewed or ref.type != Task.table():
                continue
            viewed.add(ref)
            todo += self.links.targets(self.find(ref.id), WAIT_LINK)
        return False

    def waiting(self, ref: Ref) -> Task | Question | Check:
        return self.awaitable[ref.type].find(ref.id)

    def waiting_ids(self, tasks: list[Task]) -> set[int]:
        return set(self.open_wait_refs(tasks))

    def open_wait_refs(self, tasks: list[Task]) -> dict[int, list[Ref]]:
        waits: dict[int, list[Ref]] = {}
        for link in self.links.model_links("source", tasks, WAIT_LINK):
            if not self.waiting(link.target).is_resolved():
                waits.setdefault(link.source.id, []).append(link.target)
        return waits

    def blocked_without_wait(self) -> list[Task]:
        return [task for task in self.with_state(TaskState.BLOCKED) if not self.open_waits(task)]

    def broken_waits(self) -> list[tuple[Task, Check]]:
        return [(task, check) for check in self.checks.broken_waits() for task in self.waiting_refs(check)]

    def waiting_refs(self, model) -> list[Task]:
        return [task for ref in self.links.sources(model, WAIT_LINK) if ref.type == Task.table() and (task := self.find(ref.id)).state in (TaskState.BLOCKED, TaskState.SUSPENDED)]

    def reason(self, row: Task | Plan) -> str:
        matched = [f"{ref.type[:-1]} {ref.id}" for ref in self.links.targets(row, WAIT_LINK)]
        return ", ".join(part for part in (*matched, row.waiting_reason()) if part)

    def unclosed_tasks(self) -> list[Task]:
        return [task for task in self.scoped() if not task.is_closed()]

    def unfinished_ids(self, numbers: list[int]) -> list[int]:
        return [number for number in numbers if self.matching(id=number, state=TaskState.OPEN) or self.matching(id=number, state=TaskState.STARTED)]

    def ready_waiting_tasks(self, model) -> list[Task]:
        return [task for task in self.waiting_refs(model) if not self.open_waits(task)]

    def other_started_tasks(self, current: Task | None) -> list[Task]:
        return [task for task in self.with_state(TaskState.STARTED) if current is None or task.id != current.id]

    def open_tasks(self) -> list[Task]:
        return self.actionable(TaskState.OPEN)

    def blocked_tasks(self) -> list[Task]:
        return self.actionable(TaskState.BLOCKED)

    def suspended_tasks(self) -> list[Task]:
        return self.free_tasks(TaskState.SUSPENDED, (PlanState.SUSPENDED.value,))

    def actionable(self, state: TaskState) -> list[Task]:
        return self.free_tasks(state, UNAPPROVED_PLAN_STATES)

    def free_tasks(self, state: TaskState, plan_states: tuple[str, ...]) -> list[Task]:
        tasks = self.with_state(state)
        plan_refs = {str(Ref(Plan.table(), row["id"])) for row in self.connection.all(*Query.build(Plan).filter_listed("state", list(plan_states)).select())}
        plan_task_ids = {link.source.id for link in self.links.model_links("source", tasks, PLAN_LINK) if str(link.target) in plan_refs}
        return [task for task in tasks if task.row_id not in plan_task_ids]

    def with_state(self, state: TaskState) -> list[Task]:
        return self.matching(state=state)

    def current(self, agent: Agent) -> Task | None:
        return self.holder_task(Ref.build(agent))

    def holder_task(self, holder: Ref) -> Task | None:
        ids = self.holder_task_ids(holder)
        return next((task for task in self.with_state(TaskState.STARTED) if task.row_id in ids), None)

    def holder_task_ids(self, holder: Ref) -> tuple[int, ...]:
        return tuple(link.target.id for link in self.links.all_matching(source=holder, kind=CURRENT_TASK_LINK))

    def holder(self, task: Task) -> Ref | None:
        holders = self.links.sources(task, CURRENT_TASK_LINK)
        return holders[-1] if holders else None

    def holders(self) -> dict[int, Ref]:
        return {link.target.id: link.source for link in self.links.all_matching(kind=CURRENT_TASK_LINK)}

    def holder_started(self, started: Task, holder: Ref | None, actor: Actor) -> Task:
        self.assign_holder(started, holder, actor)
        return self.save(started, actor)

    def assign_holder(self, started: Task, holder: Ref | None, actor: Actor) -> None:
        if holder is None:
            return
        counterpart = self.holder_task(holder)
        if counterpart is not None and counterpart.id != started.id:
            raise Rejection(f"task {counterpart.id} is in hand: finish it, or park it with `journal task suspend {counterpart.id} \"<why>\"`, before task {started.id} is started")
        self.handover(started, holder, actor)

    def handover(self, task: Task, holder: Ref, actor: Actor) -> None:
        owner = self.holder(task)
        if owner is not None and owner != holder and owner.type == WORKERS and not actor.is_user():
            raise Rejection(HOLDER_REFUSAL.format(task=task.id, worker=owner.id))
        target = Ref.build(task)
        for link in self.links.all_matching(target=target, kind=CURRENT_TASK_LINK):
            if link.source != holder:
                self.links.delete(link, actor)
        if owner != holder:
            self.links.save(Link(source=holder, target=target, kind=CURRENT_TASK_LINK), actor)

    def worker_task(self, task_id: int, worker: int) -> Task:
        holdings = self.holder_task_ids(Ref(WORKERS, worker))
        if task_id not in holdings:
            raise Rejection(WORKER_TASK.format(task=task_id, worker=worker, holdings=", ".join(f"task {n}" for n in holdings) or "no task"))
        return self.find(task_id)

    def release(self, holder: Ref, actor: Actor) -> None:
        for link in self.links.all_matching(source=holder, kind=CURRENT_TASK_LINK):
            self.links.delete(link, actor)

    def worker_holdings(self) -> dict[int, int]:
        return {link.target.id: link.source.id for link in self.links.all_matching(kind=CURRENT_TASK_LINK) if link.source.type == WORKERS}

    def unfinished_count(self) -> int:
        planned = self.links.query().filter(kind=PLAN_LINK).filter_ref("source", self.query())
        return self.counted(self.query().filter_unlisted("state", CLOSED).filter_absent(planned))

    def unviewed(self) -> int:
        return self.counted(self.query().filter_unlisted("state", CLOSED).filter_lacking_prefix("creator", USER_PREFIX))

    def shown(self) -> list[Task]:
        unfinished = self.selected(self.query().filter_unlisted("state", CLOSED).order("id"))
        return sorted([*unfinished, *self.newest(self.query().filter_listed("state", CLOSED))], key=lambda t: t.row_id)
