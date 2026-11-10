from typing import ClassVar, TypeVar

from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.nudge_declaration import NudgeDeclaration
from core.modules.drivers.commands.support.wake_agent import WakeAgent
from core.modules.drivers.support.nudger import Nudger
from core.modules.drivers.support.waiting_line_typing import WaitingLineTyping

WakeCommand = TypeVar("WakeCommand", bound=WakeAgent)


class WakeAgentHandler(Handler[WakeCommand, None]):
    """Saves the wake line for an agent and types it, with the lines that wait."""

    wake_nudge: ClassVar[NudgeDeclaration]
    wake_source: ClassVar[str]

    def __init__(self, nudger: Nudger, typing: WaitingLineTyping) -> None:
        self.nudger, self.typing = nudger, typing

    def handle(self, command: WakeCommand, context: Context) -> None:
        self.nudger.send(command.agent_id, self.wake_nudge, self.wake_source, context)
        self.typing.release(command.agent_id, context.actor.id, context.timestamp)
