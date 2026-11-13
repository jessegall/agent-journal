from engine.command.context import Context
from engine.command.handler import Handler
from engine.model.model import Model
from engine.driver.nudger import Nudger
from suites.coding.modules.workers.commands.send_unfinished_tasks_line.send_unfinished_tasks_line import SendUnfinishedTasksLine
from suites.coding.modules.workers.support.worker_nudges import UNFINISHED_TASKS_SOURCE, WORKER_UNFINISHED_TASKS


class SendUnfinishedTasksLineHandler(Handler[SendUnfinishedTasksLine, Model]):
    """Saves the unfinished-tasks line for the worker."""

    command = SendUnfinishedTasksLine

    def __init__(self, nudger: Nudger) -> None:
        self.nudger = nudger

    def handle(self, command: SendUnfinishedTasksLine, context: Context) -> Model:
        return self.nudger.send(command.worker_id, WORKER_UNFINISHED_TASKS, UNFINISHED_TASKS_SOURCE, context, tasks=command.tasks, line=command.line)
