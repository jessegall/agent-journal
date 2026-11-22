from engine.container.single_instance import SingleInstance
from engine.driver.hook_event import HookEvent
from engine.agent_machine.states.line_history import LineHistory
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.plans.models.plan_task import PlanTask
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery

FOCUS_RULE_NAME = "plans.focus-lines"
ACTIVE_STATES = (TaskState.STARTED, TaskState.TESTING)


class NewFocusPlaces(SingleInstance):
    """The places in a plan of the tasks the agent started since the focus lines last spoke to it: what the focus
    lines speak about, and what opens the state that asks them."""

    def __init__(self, queries: Queries, tasks: TaskQuery, history: LineHistory) -> None:
        self.queries, self.tasks, self.history = queries, tasks, history
        self.read_event: HookEvent | None = None
        self.read_places: list[PlanTask] = []

    @staticmethod
    def is_plan_start(event: HookEvent) -> bool:
        shell = event.tool.shell if event.tool is not None else None
        return bool(shell.journal_command_numbers("plan start")) if shell is not None else False

    # read once for a hook event: the state that opens on the places and the lines that speak about them share the answer
    def places(self, event: HookEvent, agent_id: int) -> list[PlanTask]:
        if self.read_event is not event:
            self.read_event, self.read_places = event, self.found(agent_id)
        return self.read_places

    def found(self, agent_id: int) -> list[PlanTask]:
        new_ids = [task.id for task in self.new_tasks(agent_id)]
        places = self.queries.query(PlanTask).matching(Among("state", ACTIVE_STATES)).matching(Among("task_id", new_ids))
        return list(places.every_row("a main agent may hold more than 50 started tasks in plans")) if new_ids else []

    def first(self, event: HookEvent, agent_id: int) -> PlanTask | None:
        return next(iter(self.places(event, agent_id)), None)

    def new_tasks(self, agent_id: int) -> list[Task]:
        started = self.tasks.started_tasks(agent_id)
        if not started:
            return []
        last_given_at = self.history.last_given(FOCUS_RULE_NAME, agent_id)
        return [task for task in started if task.started_at is not None and (last_given_at is None or task.started_at > last_given_at)]
