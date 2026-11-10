from engine.enums.agent_role import AgentRole
from core.base.listener.save_listener import SaveListener
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.base.scope.actor_scope import ActorScope
from core.modules.drivers.support.main_agent_line import MainAgentLine
from core.modules.drivers.support.nudger import Nudger
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.support.worker_nudges import BLOCKED_WORKER_TASK, WORKER_TASK_BLOCKED
from core.base.change.moved import Moved
from core.base.command.context import Context
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle


class BlockedWorkerTaskListener(SaveListener[Moved[Task]]):
    """Tells the main agent when a worker blocks its task, which needs its decision, and tells a worker when another
    agent blocked a task of its own."""

    name = "workers.blocked-task"
    moves = tuple([TaskLifecycle.block])
    disabled_scopes = [ActorScope]

    def __init__(self, main_agent_line: MainAgentLine, queries: Queries, nudger: Nudger) -> None:
        self.main_agent_line, self.queries, self.nudger = main_agent_line, queries, nudger

    def handle(self, event: Moved[Task], context: Context) -> None:
        task = event.row
        if task.delegated_to is None or self.queries.query(Agent).find(task.delegated_to).role == AgentRole.MAIN:
            return
        if task.delegated_to != context.actor.id:
            self.nudger.send(task.delegated_to, BLOCKED_WORKER_TASK, self.name, context, task=task.id)
            return
        notice = WORKER_TASK_BLOCKED.nudge(worker=task.delegated_to, task=task.id)
        self.main_agent_line.send_nudge(notice, self.name, context)
