from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.scope.actor_scope import ActorScope
from core.modules.drivers.support.main_agent_line import MainAgentLine
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.support.worker_nudges import WORKER_TASK_BLOCKED


class BlockedWorkerTaskListener(SaveListener):
    """Tells the main agent when a worker blocks its task, with the reason and the task to read."""

    name = "workers.blocked-task"
    event = "task.block"
    disabled_scopes = [ActorScope]

    def __init__(self, main_agent_line: MainAgentLine) -> None:
        self.main_agent_line = main_agent_line

    def handle(self, change: Change[Model]) -> None:
        task = change.new_row
        if not isinstance(task, Task) or task.delegated_to is None or task.delegated_to != change.actor.id:
            return
        notice = WORKER_TASK_BLOCKED.nudge(worker=task.delegated_to, task=task.id)
        self.main_agent_line.send(task.environment_id, notice.text, self.name, change.context)
