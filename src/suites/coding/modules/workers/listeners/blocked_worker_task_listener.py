from core.modules.assignments.support.assignments import Assignments
from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.enums.agent_role import AgentRole
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from core.modules.drivers.support.main_agent_line import MainAgentLine
from engine.driver.message_sender import MessageSender
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.agent_messages.blocked_worker_task_message import BlockedWorkerTaskMessage
from suites.coding.modules.workers.agent_messages.worker_task_blocked_message import WorkerTaskBlockedMessage
from engine.event.moved import Moved
from engine.command.context import Context
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle


class BlockedWorkerTaskListener(SaveListener[Moved[Task]]):
    """Tells the main agent when a worker blocks its task, which needs its decision, and tells a worker when another
    agent blocked a task of its own."""

    name = "workers.blocked-task"
    moves = tuple([TaskLifecycle.block])
    disabled_scopes = [ActorScope]

    def __init__(self, main_agent_line: MainAgentLine, message_sender: MessageSender, numbers: RowNumbers, assignments: Assignments) -> None:
        self.numbers, self.assignments = numbers, assignments
        self.main_agent_line, self.message_sender = main_agent_line, message_sender

    def handle(self, event: Moved[Task], context: Context) -> None:
        task = event.row
        worker = self.assignments.agent(task)
        if worker is None or worker.role == AgentRole.MAIN:
            return
        if worker.id != context.actor.id:
            self.message_sender.send(worker.id, BlockedWorkerTaskMessage.declared(), self.name, context, task=task.id)
            return
        notice = WorkerTaskBlockedMessage.declared().agent_message(worker=self.numbers.number(AGENT_MODEL_NAME, worker.id), task=task.id)
        self.main_agent_line.send_agent_message(notice, self.name, context)
