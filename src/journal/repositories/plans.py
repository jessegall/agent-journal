from journal.db.connection import Connection
from journal.features.bus import Bus
from journal.models.plan import Plan
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.links import Links
from journal.repositories.scoped_repository import ScopedRepository
from journal.repositories.tasks import Tasks

IN_PLAN = "in_plan"


class Plans(ScopedRepository[Plan]):
    model = Plan

    def __init__(self, connection: Connection, bus: Bus, links: Links, tasks: Tasks) -> None:
        super().__init__(connection, bus)
        self.links, self.tasks = links, tasks

    def tasks_of(self, plan: Plan) -> list[Task]:
        """In the order they were added."""
        return [self.tasks.find(ref.id) for ref in self.links.sources(plan, IN_PLAN)]

    def next_task(self, plan: Plan) -> Task | None:
        return next((t for t in self.tasks_of(plan) if t.state == TaskState.OPEN), None)
