from journal.db.connection import Connection
from journal.features.bus import Bus
from journal.models.phase import Phase
from journal.models.plan import Plan
from journal.models.plan_state import PlanState
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.links import Links
from journal.repositories.phases import Phases
from journal.repositories.scoped_repository import ScopedRepository
from journal.repositories.tasks import Tasks

IN_PLAN = "in_plan"
PHASE_OF = "phase_of"
IN_PHASE = "in_phase"


class Plans(ScopedRepository[Plan]):
    model = Plan

    def __init__(self, connection: Connection, bus: Bus, links: Links, tasks: Tasks, phases: Phases) -> None:
        super().__init__(connection, bus)
        self.links, self.tasks, self.phases = links, tasks, phases

    def tasks_of(self, plan: Plan) -> list[Task]:
        """In the order they were added."""
        return [self.tasks.find(ref.id) for ref in self.links.sources(plan, IN_PLAN)]

    def phases_of(self, plan: Plan) -> list[Phase]:
        """In the order they were added."""
        return [self.phases.find(ref.id) for ref in self.links.sources(plan, PHASE_OF)]

    def tasks_in(self, phase: Phase) -> list[Task]:
        return [self.tasks.find(ref.id) for ref in self.links.sources(phase, IN_PHASE)]

    def in_order(self, plan: Plan) -> list[Task]:
        """Phase by phase, then the tasks under no phase."""
        phased = [t for phase in self.phases_of(plan) for t in self.tasks_in(phase)]
        ids = {t.id for t in phased}
        return phased + [t for t in self.tasks_of(plan) if t.id not in ids]

    def free(self, environment_id: int) -> list[Task]:
        """The open tasks an agent may take up on its own: a plan not yet started hands out its own, so those wait."""
        return [t for t in self.tasks.in_state(environment_id, TaskState.OPEN) if not self.held_back(t)]

    def held_back(self, task: Task) -> bool:
        return any(self.find(ref.id).state != PlanState.STARTED for ref in self.links.targets(task, IN_PLAN))

    def next_task(self, plan: Plan) -> Task | None:
        return next((t for t in self.in_order(plan) if t.state == TaskState.OPEN), None)
