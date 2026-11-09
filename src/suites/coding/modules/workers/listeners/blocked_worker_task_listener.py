from core.base.agent_role import AgentRole
from core.base.listener.save_listener import SaveListener
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.base.scope.actor_scope import ActorScope
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.support.worker_nudges import WORKER_TASK_BLOCKED
from core.base.change.moved import Moved
from core.base.command.context import Context
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle


class BlockedWorkerTaskListener(SaveListener[Moved[Task]]):
    """Tells the main agent when a worker blocks its task, with the reason and the task to read."""

    name = "workers.blocked-task"
    moves = tuple([TaskLifecycle.block])
    disabled_scopes = [ActorScope]

    def __init__(self, main_agent_line: MergerInbox, queries: Queries) -> None:
        self.main_agent_line, self.queries = main_agent_line, queries

    def handle(self, event: Moved[Task], context: Context) -> None:
        task = event.row
        if task.delegated_to is None or task.delegated_to != context.actor.id:
            return
        if self.queries.query(Agent).find(task.delegated_to).role == AgentRole.MAIN:
            return
        notice = WORKER_TASK_BLOCKED.nudge(worker=task.delegated_to, task=task.id)
        self.main_agent_line.send_nudge(notice, self.name, context)
