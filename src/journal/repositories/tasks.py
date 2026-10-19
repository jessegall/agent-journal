from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.models.check import Check
from journal.models.plan import Plan
from journal.models.question import Question
from journal.models.ref import Ref
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.refused import Refused
from journal.repositories.checks import Checks
from journal.repositories.links import Links
from journal.repositories.questions import Questions
from journal.repositories.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository

WAITS_ON = "waits_on"


class Tasks(ScopedRepository[Task]):
    model = Task

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, links: Links, questions: Questions, checks: Checks) -> None:
        super().__init__(connection, bus, scope)
        self.links, self.checks = links, checks
        self.awaitable = {Task.table(): self, Question.table(): questions, Check.table(): checks}

    def open_waits(self, row: Task | Plan) -> list[Ref]:
        return [ref for ref in self.links.targets(row, WAITS_ON) if not self.awaited(ref).is_settled()]

    def waits_reach(self, start: Ref, goal: Ref) -> bool:
        """Whether following the wait links from start ever comes to goal."""
        seen, todo = set(), [start]
        while todo:
            ref = todo.pop()
            if ref == goal:
                return True
            if ref in seen or ref.type != Task.table():
                continue
            seen.add(ref)
            todo += self.links.targets(self.find(ref.id), WAITS_ON)
        return False

    def awaited(self, ref: Ref) -> Task | Question | Check:
        return self.awaitable[ref.type].find(ref.id)

    def blocked_outside(self) -> list[Task]:
        return [task for task in self.in_state(TaskState.BLOCKED) if not self.open_waits(task)]

    def broken_waits(self) -> list[tuple[Task, Check]]:
        return [(task, check) for check in self.checks.broken_waits() for task in self.waiting_on(check)]

    def waiting_on(self, model) -> list[Task]:
        """The tasks blocked on this row by a wait link."""
        return [task for ref in self.links.sources(model, WAITS_ON) if ref.type == Task.table() and (task := self.find(ref.id)).state == TaskState.BLOCKED]

    def reason(self, row: Task | Plan) -> str:
        named = [f"{ref.type[:-1]} {ref.id}" for ref in self.links.targets(row, WAITS_ON)]
        return ", ".join(part for part in (*named, row.blocked_why) if part)

    def in_state(self, state: TaskState) -> list[Task]:
        return self.where(state=state)

    def in_hand(self) -> Task | None:
        """The one task started here, when one is."""
        return next(iter(self.in_state(TaskState.STARTED)), None)

    def refuse_second(self, task: Task) -> None:
        """One task in hand at a time: a task is started only while no other is."""
        other = self.in_hand()
        if task.state == TaskState.STARTED and other is not None and other.id != task.id:
            raise Refused(f"task {other.id} is in hand: finish it, or park it with `journal task park {other.id} \"<why>\"`, before task {task.id} is started")

    def unfinished_count(self) -> int:
        """How many tasks under no plan are not yet done or cancelled, counted by the database: a plan's tasks are counted on the plan."""
        return self.counted_in("state NOT IN (?, ?) AND NOT EXISTS (SELECT 1 FROM links WHERE links.kind = 'in_plan' AND links.source = 'tasks:' || tasks.id)",
                               (TaskState.DONE.value, TaskState.CANCELLED.value))

    def unseen_by_user(self) -> int:
        """How many unfinished tasks the user did not make, so has not yet seen."""
        return self.counted_in("state NOT IN (?, ?) AND (created_by IS NULL OR created_by NOT LIKE 'user:%')", (TaskState.DONE.value, TaskState.CANCELLED.value))

    def shown(self) -> list[Task]:
        """What a list of tasks shows: every one not yet finished, however old, and the newest page of the finished ones, by number."""
        finished = (TaskState.DONE.value, TaskState.CANCELLED.value)
        unfinished = self.selected("state NOT IN (?, ?) ORDER BY id", (*finished,))
        return sorted([*unfinished, *self.newest("state IN (?, ?)", (*finished,))], key=lambda t: t.id)
