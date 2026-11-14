from engine.container.single_instance import SingleInstance
from engine.driver.agent_hook import AgentHook
from engine.driver.hook_event import HookEvent
from engine.driver.hook_history import HookHistory
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.plans.models.plan_task import PlanTask
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery

FOCUS_RULE_NAME = "plans.focus-lines"
ACTIVE_STATES = (TaskState.STARTED, TaskState.TESTING)


class NewFocusPlaces(SingleInstance):
    """The places in a plan of the tasks the agent started since the focus rule last answered it: what the focus rule
    speaks about, and what opens the state that asks it."""

    def __init__(self, queries: Queries, tasks: TaskQuery, hook_history: HookHistory) -> None:
        self.queries, self.tasks, self.hook_history = queries, tasks, hook_history
        self.read_event: HookEvent | None = None
        self.read_places: list[PlanTask] = []

    @staticmethod
    def starts_plan(hook: AgentHook) -> bool:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        return bool(shell.journal_command_numbers("plan start")) if shell is not None else False

    # read once for a hook event: the state that opens on the places and the rule that speaks about them share the answer,
    # though each is given its own copy of the hook
    def places(self, hook: AgentHook) -> list[PlanTask]:
        if self.read_event is not hook.event:
            self.read_event, self.read_places = hook.event, self.found(hook)
        return self.read_places

    def found(self, hook: AgentHook) -> list[PlanTask]:
        new_ids = [task.id for task in self.new_tasks(hook)]
        return self.queries.query(PlanTask).matching(Among("state", ACTIVE_STATES)).matching(Among("task_id", new_ids)).get() if new_ids else []

    def first(self, hook: AgentHook) -> PlanTask | None:
        return next(iter(self.places(hook)), None)

    def new_tasks(self, hook: AgentHook) -> list[Task]:
        started = self.tasks.started_tasks(hook.agent_id)
        if not started:
            return []
        answered_at = self.hook_history.last_answer(FOCUS_RULE_NAME, hook)
        return [task for task in started if task.started_at is not None and (answered_at is None or task.started_at > answered_at)]
