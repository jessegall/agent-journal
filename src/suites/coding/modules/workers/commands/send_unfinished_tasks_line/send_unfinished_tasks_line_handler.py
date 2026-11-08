from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.nudger import Nudger
from suites.coding.modules.workers.commands.send_unfinished_tasks_line.send_unfinished_tasks_line import SendUnfinishedTasksLine
from suites.coding.modules.workers.support.worker_job import UNFINISHED_TASKS_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_UNFINISHED_TASKS


class SendUnfinishedTasksLineHandler(Handler[SendUnfinishedTasksLine, AgentLine]):
    """Saves the unfinished-tasks line for the worker."""

    command = SendUnfinishedTasksLine

    def __init__(self, nudger: Nudger) -> None:
        self.nudger = nudger

    def handle(self, command: SendUnfinishedTasksLine, context: Context) -> AgentLine:
        return self.nudger.send(command.worker_id, WORKER_UNFINISHED_TASKS, UNFINISHED_TASKS_SOURCE, context)
