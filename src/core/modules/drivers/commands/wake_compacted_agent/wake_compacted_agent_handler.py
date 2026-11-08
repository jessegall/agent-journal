from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.drivers.commands.wake_compacted_agent.wake_compacted_agent import WakeCompactedAgent
from core.modules.drivers.support.driver_nudges import AGENT_COMPACTED
from core.modules.drivers.support.nudger import Nudger
from core.modules.drivers.support.waiting_line_typing import WaitingLineTyping

WAKE_SOURCE = "drivers.compacted"


class WakeCompactedAgentHandler(Handler[WakeCompactedAgent, None]):
    """Saves the wake line for the agent and types it, with the lines that wait."""

    command = WakeCompactedAgent

    def __init__(self, nudger: Nudger, typing: WaitingLineTyping) -> None:
        self.nudger, self.typing = nudger, typing

    def handle(self, command: WakeCompactedAgent, context: Context) -> None:
        self.nudger.send(command.agent_id, AGENT_COMPACTED, WAKE_SOURCE, context)
        self.typing.release(command.agent_id, context.actor.id, context.timestamp)
