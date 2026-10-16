from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row, seconds
from journal.models.task_state import TaskState
from journal.repositories.tasks import Tasks

STATUS = {TaskState.OPEN: "open", TaskState.STARTED: "started", TaskState.PARKED: "parked", TaskState.BLOCKED: "blocked", TaskState.DONE: "done", TaskState.CANCELLED: "abandoned"}


class TodosShaper(Shaper):
    """A task is what version 3 called a to-do."""

    type = "todo"

    def __init__(self, tasks: Tasks) -> None:
        self.tasks = tasks

    def rows(self) -> list[V3Row]:
        return [self.row(t) for t in self.tasks.in_()]

    @staticmethod
    def row(t) -> V3Row:
        return V3Row.of("todo", t, title=t.title, brief=t.brief, outcome=t.outcome, completed=seconds(t.finished_at),
                        data={"status": STATUS[t.state], "work": t.id if t.state != TaskState.OPEN else 0, "parked": t.state == TaskState.PARKED, "parked_why": t.parked_why, "blocked": t.blocked_why if t.state == TaskState.BLOCKED else "", "priority": 3, "rank": 0.0, "after": [], "struck": False, "hidden": False})
