from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.commands.start_task.start_task import StartTask
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.support.next_task import NextTask
from suites.coding.coding_settings import AUTO_MODE_SETTING

LEAVES_HAND = ("task.close", "task.cancel", "task.block", "task.release")
HOLDER_FIELD = "holder_id"
RELEASE_EVENT = "task.release"


class AutoNextTaskListener(CommitListener):
    """While auto mode is on, a task that leaves the main agent's hands, closed, cancelled, blocked
    or released, is followed at once by the next task, started for that agent."""

    name = "coding.auto-next-task"
    event = "task.*"

    def __init__(self, bus: Bus, queries: Queries, tasks: TaskQuery, next_task: NextTask, settings: SettingValues) -> None:
        self.bus, self.queries, self.tasks, self.next_task, self.settings = bus, queries, tasks, next_task, settings

    def handle(self, event: LoggedEvent) -> None:
        if event.event not in LEAVES_HAND or not self.settings.flag(AUTO_MODE_SETTING, event.environment_id):
            return
        closed_task = self.queries.query(Task).find(event.row_id)
        holder_id = event.data[HOLDER_FIELD][0] if HOLDER_FIELD in event.data else closed_task.holder_id
        if not isinstance(holder_id, int) or self.queries.query(Agent).find(holder_id).role is not AgentRole.MAIN:
            return
        if self.tasks.holder(holder_id).started().exists():
            return
        next_row = self.next_task.following(closed_task.environment_id, closed_task.id if event.event == RELEASE_EVENT else None)
        if next_row is not None:
            self.bus.run(StartTask(next_row.id), Actor(holder_id, ActorType.AGENT), cause_id=event.id, environment_id=event.environment_id)
