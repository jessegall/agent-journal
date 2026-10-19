from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.models.question import Question
from journal.models.ref import Ref
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.refused import Refused
from journal.repositories.links import Links
from journal.repositories.questions import Questions
from journal.repositories.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository

WAITS_ON = "waits_on"


class Tasks(ScopedRepository[Task]):
    model = Task

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, links: Links, questions: Questions) -> None:
        super().__init__(connection, bus, scope)
        self.links, self.questions = links, questions

    def open_waits(self, task: Task) -> list[Ref]:
        """What the task waits on by a link that is still not answered, done or cancelled."""
        return [ref for ref in self.links.targets(task, WAITS_ON) if not self.awaited(ref).is_settled()]

    def awaited(self, ref: Ref) -> Task | Question:
        """The row a wait link names: a task or a question."""
        return self.find(ref.id) if ref.type == Task.table() else self.questions.find(ref.id)

    def waiting_on(self, model) -> list[Task]:
        """The tasks blocked on this row by a wait link."""
        return [task for ref in self.links.sources(model, WAITS_ON) if (task := self.find(ref.id)).state == TaskState.BLOCKED]

    def reason(self, task: Task) -> str:
        """Why the task is blocked: what its wait links name, then the prose beside them."""
        named = [f"{ref.type[:-1]} {ref.id}" for ref in self.links.targets(task, WAITS_ON)]
        return ", ".join(part for part in (*named, task.blocked_why) if part)

    def in_state(self, state: TaskState) -> list[Task]:
        return self.where(environment_id=self.scope.id, state=state)

    def in_hand(self) -> Task | None:
        """The one task started here, when one is."""
        return next(iter(self.in_state(TaskState.STARTED)), None)

    def refuse_second(self, task: Task) -> None:
        """One task in hand at a time: a task is started only while no other is."""
        other = self.in_hand()
        if task.state == TaskState.STARTED and other is not None and other.id != task.id:
            raise Refused(f"task {other.id} is in hand: finish it, or park it with `journal task park {other.id} \"<why>\"`, before task {task.id} is started")

    def unfinished_count(self) -> int:
        """How many tasks are not yet done or cancelled, counted by the database."""
        return self.connection.one("SELECT count(*) AS n FROM tasks WHERE environment_id = ? AND state NOT IN (?, ?)", (self.scope.id, TaskState.DONE.value, TaskState.CANCELLED.value))["n"]

    def unseen_by_user(self) -> int:
        """How many unfinished tasks the user did not make, so has not yet seen."""
        return self.counted_in("state NOT IN (?, ?) AND (created_by IS NULL OR created_by NOT LIKE 'user:%')", (TaskState.DONE.value, TaskState.CANCELLED.value))

    def shown(self) -> list[Task]:
        """What a list of tasks shows: every one not yet finished, however old, and the newest page of the finished ones, by number."""
        finished = (TaskState.DONE.value, TaskState.CANCELLED.value)
        unfinished = self.selected("environment_id = ? AND state NOT IN (?, ?) ORDER BY id", (self.scope.id, *finished))
        return sorted([*unfinished, *self.newest("environment_id = ? AND state IN (?, ?)", (self.scope.id, *finished))], key=lambda t: t.id)
