from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.models.check import Check
from journal.models.plan import Plan
from journal.models.question import Question
from journal.support.ref import Ref
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.support.rejection import Rejection
from journal.repositories.checks import Checks
from journal.repositories.links import Links
from journal.repositories.questions import Questions
from journal.support.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository

WAIT_LINK = "waits_on"


class Tasks(ScopedRepository[Task]):
    model = Task

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, links: Links, questions: Questions, checks: Checks) -> None:
        super().__init__(connection, bus, scope)
        self.links, self.checks = links, checks
        self.awaitable = {Task.table(): self, Question.table(): questions, Check.table(): checks}

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
        return {link.source.id for link in self.links.linked("source", tasks, WAIT_LINK) if not self.waiting(link.target).is_resolved()}

    def blocked_without_wait(self) -> list[Task]:
        return [task for task in self.with_state(TaskState.BLOCKED) if not self.open_waits(task)]

    def broken_waits(self) -> list[tuple[Task, Check]]:
        return [(task, check) for check in self.checks.broken_waits() for task in self.waiting_refs(check)]

    def waiting_refs(self, model) -> list[Task]:
        return [task for ref in self.links.sources(model, WAIT_LINK) if ref.type == Task.table() and (task := self.find(ref.id)).state == TaskState.BLOCKED]

    def reason(self, row: Task | Plan) -> str:
        matched = [f"{ref.type[:-1]} {ref.id}" for ref in self.links.targets(row, WAIT_LINK)]
        return ", ".join(part for part in (*matched, row.block_reason) if part)

    def with_state(self, state: TaskState) -> list[Task]:
        return self.matching(state=state)

    def current(self) -> Task | None:
        return next(iter(self.with_state(TaskState.STARTED)), None)

    def refuse_second(self, task: Task) -> None:
        counterpart = self.current()
        if task.state == TaskState.STARTED and counterpart is not None and counterpart.id != task.id:
            raise Rejection(f"task {counterpart.id} is in hand: finish it, or park it with `journal task suspend {counterpart.id} \"<why>\"`, before task {task.id} is started")

    def unfinished_count(self) -> int:
        return self.count("state NOT IN (?, ?) AND NOT EXISTS (SELECT 1 FROM links WHERE links.kind = 'in_plan' AND links.source = 'tasks:' || tasks.id)",
                               (TaskState.FINISHED.value, TaskState.CANCELLED.value))

    def unviewed(self) -> int:
        return self.count("state NOT IN (?, ?) AND (creator IS NULL OR creator NOT LIKE 'user:%')", (TaskState.FINISHED.value, TaskState.CANCELLED.value))

    def shown(self) -> list[Task]:
        finished = (TaskState.FINISHED.value, TaskState.CANCELLED.value)
        unfinished = self.selected("state NOT IN (?, ?) ORDER BY id", (*finished,))
        return sorted([*unfinished, *self.newest("state IN (?, ?)", (*finished,))], key=lambda t: t.id)
