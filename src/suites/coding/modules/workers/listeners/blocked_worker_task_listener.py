from core.modules.assignments.support.assignments import Assignments
from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.enums.agent_role import AgentRole
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from core.modules.drivers.support.main_agent_line import MainAgentLine
from engine.driver.nudger import Nudger
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.support.worker_nudges import BLOCKED_WORKER_TASK, WORKER_TASK_BLOCKED
from engine.event.moved import Moved
from engine.command.context import Context
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle


class BlockedWorkerTaskListener(SaveListener[Moved[Task]]):
    """Tells the main agent when a worker blocks its task, which needs its decision, and tells a worker when another
    agent blocked a task of its own."""

    name = "workers.blocked-task"
    moves = tuple([TaskLifecycle.block])
    disabled_scopes = [ActorScope]

    def __init__(self, main_agent_line: MainAgentLine, nudger: Nudger, numbers: RowNumbers, assignments: Assignments) -> None:
        self.numbers, self.assignments = numbers, assignments
        self.main_agent_line, self.nudger = main_agent_line, nudger

    def handle(self, event: Moved[Task], context: Context) -> None:
        task = event.row
        worker = self.assignments.agent(task)
        if worker is None or worker.role == AgentRole.MAIN:
            return
        if worker.id != context.actor.id:
            self.nudger.send(worker.id, BLOCKED_WORKER_TASK, self.name, context, task=task.id)
            return
        notice = WORKER_TASK_BLOCKED.nudge(worker=self.numbers.number(AGENT_MODEL_NAME, worker.id), task=task.id)
        self.main_agent_line.send_nudge(notice, self.name, context)
