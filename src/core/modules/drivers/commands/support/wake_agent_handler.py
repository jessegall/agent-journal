from typing import ClassVar, TypeVar

from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.message_template import MessageTemplate
from core.modules.drivers.commands.support.wake_agent import WakeAgent
from engine.driver.message_sender import MessageSender
from core.modules.drivers.support.waiting_line_typing import WaitingLineTyping

WakeCommand = TypeVar("WakeCommand", bound=WakeAgent)


class WakeAgentHandler(Handler[WakeCommand, None]):
    """Saves the wake line for an agent and types it, with the lines that wait."""

    wake_agent_message: ClassVar[MessageTemplate]
    wake_source: ClassVar[str]

    def __init__(self, message_sender: MessageSender, typing: WaitingLineTyping) -> None:
        self.message_sender, self.typing = message_sender, typing

    def handle(self, command: WakeCommand, context: Context) -> None:
        self.message_sender.send(command.agent_id, self.wake_agent_message, self.wake_source, context)
        self.typing.release(command.agent_id, context.actor.id, context.timestamp)
