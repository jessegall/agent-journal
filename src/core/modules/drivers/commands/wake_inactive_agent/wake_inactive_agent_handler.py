from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.drivers.commands.wake_inactive_agent.wake_inactive_agent import WakeInactiveAgent
from core.modules.drivers.support.driver_nudges import CACHE_KEEPALIVE
from core.modules.drivers.support.nudger import Nudger
from core.modules.drivers.support.waiting_line_typing import WaitingLineTyping

WAKE_SOURCE = "drivers.cache_keepalive"


class WakeInactiveAgentHandler(Handler[WakeInactiveAgent, None]):
    """Saves the keepalive line for the agent and types it, with the lines that wait."""

    command = WakeInactiveAgent

    def __init__(self, nudger: Nudger, typing: WaitingLineTyping) -> None:
        self.nudger, self.typing = nudger, typing

    def handle(self, command: WakeInactiveAgent, context: Context) -> None:
        self.nudger.send(command.agent_id, CACHE_KEEPALIVE, WAKE_SOURCE, context)
        self.typing.release(command.agent_id, context.actor.id, context.timestamp)
