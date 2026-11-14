from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.commands.type_waiting_lines.type_waiting_lines import TypeWaitingLines
from core.modules.drivers.support.waiting_line_typing import WaitingLineTyping


class TypeWaitingLinesHandler(Handler[TypeWaitingLines, None]):
    """Types each waiting line of the agent that may be typed now."""

    command = TypeWaitingLines

    def __init__(self, typing: WaitingLineTyping) -> None:
        self.typing = typing

    def handle(self, command: TypeWaitingLines, context: Context) -> None:
        self.typing.release(command.agent_id, context.actor.id, context.timestamp)
