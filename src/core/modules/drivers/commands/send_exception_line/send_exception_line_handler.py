from engine.command.context import Context
from engine.command.handler import Handler
from engine.scope.actor_scope import ActorScope
from core.modules.developer.commands.send_exception_line.send_exception_line import SendExceptionLine
from core.modules.developer.agent_messages.exception_line_message import ExceptionLineMessage
from engine.driver.message_sender import MessageSender

EXCEPTION_LINE_SOURCE = "developer.exception"


class SendExceptionLineHandler(Handler[SendExceptionLine, None]):
    """Gives the main agent the line about one exception."""

    command = SendExceptionLine
    disabled_scopes = [ActorScope]

    def __init__(self, message_sender: MessageSender) -> None:
        self.message_sender = message_sender

    def handle(self, command: SendExceptionLine, context: Context) -> None:
        self.message_sender.send(command.agent_id, ExceptionLineMessage.declared(), EXCEPTION_LINE_SOURCE, context, exception=command.exception_id)
