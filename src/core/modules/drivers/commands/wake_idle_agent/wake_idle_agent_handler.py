from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.drivers.commands.wake_idle_agent.wake_idle_agent import WakeIdleAgent
from core.modules.drivers.support.driver_nudges import CACHE_KEEPALIVE
from core.modules.drivers.support.nudger import Nudger
from core.modules.drivers.support.waiting_line_typing import WaitingLineTyping

WAKE_SOURCE = "drivers.cache_keepalive"


class WakeIdleAgentHandler(Handler[WakeIdleAgent, None]):
    """Saves the keepalive line for the agent and types it, with the lines that wait."""

    command = WakeIdleAgent

    def __init__(self, nudger: Nudger, typing: WaitingLineTyping) -> None:
        self.nudger, self.typing = nudger, typing

    def handle(self, command: WakeIdleAgent, context: Context) -> None:
        self.nudger.send(command.agent_id, CACHE_KEEPALIVE, WAKE_SOURCE, context)
        self.typing.release(command.agent_id, context.actor.id, context.timestamp)
