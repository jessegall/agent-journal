from engine.command.context import Context
from engine.command.handler import Handler
from engine.model.model import Model
from engine.driver.message_sender import MessageSender
from suites.coding.modules.workers.commands.send_unfinished_tasks_line.send_unfinished_tasks_line import SendUnfinishedTasksLine


class SendUnfinishedTasksLineHandler(Handler[SendUnfinishedTasksLine, Model]):
    """Saves the unfinished-tasks line for the worker."""

    command = SendUnfinishedTasksLine

    def __init__(self, message_sender: MessageSender) -> None:
        self.message_sender = message_sender

    def handle(self, command: SendUnfinishedTasksLine, context: Context) -> Model:
        return self.message_sender.send_agent_message(command.worker_id, command.line, command.source, context)
