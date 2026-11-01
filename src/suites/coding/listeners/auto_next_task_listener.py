from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.commands.start_task import StartTask
from core.modules.tasks.models.enums.task_priority import TaskPriority
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.coding_settings import AUTO_MODE_SETTING

LEAVES_HAND = ("task.close", "task.cancel", "task.block", "task.release")
URGENCY = {TaskPriority.HIGH: 0, TaskPriority.NORMAL: 1, TaskPriority.LOW: 2}


class AutoNextTaskListener(CommitListener):
    """While auto mode is on, a task that leaves an agent's hands, closed, cancelled, blocked or released, is followed at
    once by the most urgent open task of the environment, the oldest among the same urgency, started for that agent."""

    name = "coding.auto-next-task"
    event = "task.*"

    def __init__(self, bus: Bus, queries: Queries, settings: SettingValues) -> None:
        self.bus, self.queries, self.settings = bus, queries, settings

    def handle(self, event: LoggedEvent) -> None:
        if event.event not in LEAVES_HAND or not self.settings.flag(AUTO_MODE_SETTING, event.environment_id):
            return
        left = self.queries.query(Task).find(event.row_id)
        agent_id = left.holder_id if left.holder_id is not None else event.actor_id
        if self.queries.query(Task).filter(holder_id=agent_id, state=TaskState.STARTED).exists():
            return
        open_tasks = list(self.queries.query(Task).filter(environment_id=left.environment_id, state=TaskState.OPEN).all_rows())
        if open_tasks:
            following = min(open_tasks, key=lambda task: (URGENCY[task.priority], task.id))
            self.bus.run(StartTask(following.id), Actor(agent_id, ActorType.AGENT), cause_id=event.id, environment_id=event.environment_id)
