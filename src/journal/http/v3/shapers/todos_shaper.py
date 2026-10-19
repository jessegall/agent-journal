from journal.http.v3.row_counts import RowCounts
from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row, seconds
from journal.models.task_state import TaskState
from journal.models.worker import Worker
from journal.repositories.workers import Workers
from journal.repositories.plans import IN_PLAN
from journal.repositories.tasks import Tasks

STATUS = {TaskState.OPEN: "open", TaskState.STARTED: "started", TaskState.PARKED: "parked", TaskState.BLOCKED: "blocked", TaskState.DONE: "done", TaskState.CANCELLED: "abandoned"}


class TodosShaper(Shaper):
    """A task is what version 3 called a to-do."""

    type = "todo"

    def __init__(self, tasks: Tasks, workers: Workers) -> None:
        self.tasks, self.workers = tasks, workers

    def rows(self) -> list[V3Row]:
        """Every task; one that belongs to a plan is hidden from the Tasks list, which is for the tasks under no plan, and is seen on its plan."""
        in_plans, shown = self.tasks.linked(IN_PLAN), self.tasks.shown()
        held = self.workers.holding({t.id for t in shown})
        return [self.row(t, t.id in in_plans, held.get(t.id)) for t in shown]

    def counts(self, rows: list[V3Row]) -> RowCounts:
        return RowCounts(all=self.count_all(), open=self.tasks.unfinished_count(), unread=self.tasks.unseen_by_user())

    def count_all(self) -> int:
        return self.tasks.counted_in()

    @staticmethod
    def row(t, in_a_plan: bool, held_by: Worker | None) -> V3Row:
        return V3Row.of("todo", t, title=t.title, brief=t.brief, outcome=t.outcome, completed=seconds(t.finished_at),
                        data={"status": STATUS[t.state], "work": t.id if t.state != TaskState.OPEN else 0, "parked": t.state == TaskState.PARKED, "parked_why": t.parked_why, "blocked": t.blocked_why if t.state == TaskState.BLOCKED else "", "priority": 3, "rank": 0.0, "after": [], "struck": False, "hidden": in_a_plan, "assigned": f"helper:{held_by.id}" if held_by else ""})
