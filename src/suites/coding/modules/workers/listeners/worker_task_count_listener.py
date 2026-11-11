from core.modules.agents.models.agent import Agent
from engine.driver.nudger import Nudger
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from engine.command.context import Context
from engine.event.moved import Moved
from engine.listener.rows.event_rows import EventRows
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from suites.coding.modules.workers.support.worker_nudges import WORKER_TASK_COUNT
from suites.coding.modules.workers.support.worker_task_limit import WorkerTaskLimit


class WorkerTaskCountListener(SaveListener[Moved[Task]]):
    """Tells a worker that started a task beside the ones it has started how many it has started and
    the most it may have started at once."""

    name = "workers.started-task-count"
    moves = tuple([TaskLifecycle.start])
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, limit: WorkerTaskLimit, nudger: Nudger) -> None:
        self.rows, self.limit, self.nudger = rows, limit, nudger

    def handle(self, event: Moved[Task], context: Context) -> None:
        agent = self.rows.find(Agent, context.actor.id)
        if agent is None or agent.role != CodingHelperRole.WORKER:
            return
        started_count = self.limit.started_count(agent.id, event.row)
        if started_count:
            self.nudger.send(agent.id, WORKER_TASK_COUNT, self.name, context, count=started_count + 1, limit=self.limit.maximum())
